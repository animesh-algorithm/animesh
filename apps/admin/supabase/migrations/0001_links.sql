begin;
create schema if not exists private;
revoke all on schema private from public;
create table private.owner_config (
 singleton boolean primary key default true check(singleton),
 user_id uuid not null, email text not null check(email = lower(email))
);
revoke all on private.owner_config from public, anon, authenticated;
create function public.is_link_owner() returns boolean language sql stable security definer
set search_path = '' as $$
 select exists(select 1 from private.owner_config c where c.user_id = auth.uid()
 and c.email = lower(auth.jwt()->>'email')
 and auth.jwt()->'app_metadata'->>'provider' = 'google');
$$;
revoke all on function public.is_link_owner() from public;
grant execute on function public.is_link_owner() to authenticated;
create function public.valid_link_slug(s text) returns boolean language sql immutable set search_path = '' as $$
 select length(s) between 1 and 256 and s collate "C" ~ '^[A-Za-z0-9_.-]+(/[A-Za-z0-9_.-]+)*$'
 and not exists(select 1 from unnest(string_to_array(s,'/')) x where x in ('.','..'))
 and lower(split_part(s,'/',1)) not in ('_next','api','auth','.well-known','favicon.ico','icon.svg','_not-found','robots.txt','sitemap.xml');
$$;
create table public.links (
 id uuid primary key default gen_random_uuid(),
 slug text collate "C" not null unique check(public.valid_link_slug(slug)),
 destination text not null check(length(destination) <= 8192 and destination ~* '^https?://[^/@[:space:]]+([/?#]|$)' and destination !~* '^https?://link[.]animesh[.]cc[.]?([:/?#]|$)'),
 title text check(length(title)<=256), creator uuid not null default auth.uid(),
 created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
 deleted_at timestamptz, source text not null default 'native' check(source in ('native','migrated')),
 migration_source_domain text, lifetime_count bigint not null default 0 check(lifetime_count>=0), last_click_at timestamptz
);
create table public.click_events (
 id uuid primary key, link_id uuid not null references public.links(id), occurred_at timestamptz not null,
 ip_hash text check(ip_hash is null or ip_hash ~ '^[a-f0-9]{64}$'), country text not null default 'Unknown', city text not null default 'Unknown',
 latitude double precision check(latitude between -90 and 90), longitude double precision check(longitude between -180 and 180),
 device text not null default 'Unknown', browser text not null default 'Unknown', os text not null default 'Unknown',
 referrer_domain text not null default 'Direct / Unknown', is_bot boolean not null default false
);
create index click_events_link_time on public.click_events(link_id,occurred_at desc,id);
create index click_events_link_hash_time on public.click_events(link_id,ip_hash,occurred_at) where ip_hash is not null;
create index links_recent_click on public.links(last_click_at desc nulls last);
alter table public.links enable row level security;
alter table public.click_events enable row level security;
revoke all on public.links,public.click_events from public,anon,authenticated;
grant select,insert on public.links to authenticated;
grant update(destination,title,deleted_at) on public.links to authenticated;
grant select on public.click_events to authenticated;
create policy owner_read_links on public.links for select to authenticated using(public.is_link_owner());
create policy owner_create_links on public.links for insert to authenticated with check(public.is_link_owner() and creator=auth.uid() and source='native' and migration_source_domain is null and lifetime_count=0 and last_click_at is null and deleted_at is null);
create policy owner_update_links on public.links for update to authenticated using(public.is_link_owner() and deleted_at is null) with check(public.is_link_owner());
create policy owner_read_events on public.click_events for select to authenticated using(public.is_link_owner());
create function private.guard_link_update() returns trigger language plpgsql set search_path = '' as $$
 begin
 if new.id is distinct from old.id or new.slug is distinct from old.slug or new.creator is distinct from old.creator or new.created_at is distinct from old.created_at or new.source is distinct from old.source or new.migration_source_domain is distinct from old.migration_source_domain then raise exception 'immutable link fields'; end if;
 if old.deleted_at is not null and (new.destination is distinct from old.destination or new.title is distinct from old.title or new.deleted_at is distinct from old.deleted_at) then raise exception 'deleted link is immutable'; end if;
 new.updated_at=now(); return new;
 end;
$$;
create trigger guard_link_update before update on public.links for each row execute function private.guard_link_update();
do $$ begin if not exists(select 1 from pg_roles where rolname='links_runtime') then create role links_runtime login noinherit; end if; end $$;
revoke all on public.links,public.click_events from links_runtime;
grant usage on schema public to links_runtime;
create function public.resolve_link(p_slug text) returns table(id uuid,destination text,deleted boolean) language sql stable security definer set search_path = '' as $$
 select id,case when deleted_at is null then destination else null end,deleted_at is not null from public.links where slug=p_slug;
$$;
create function public.record_click(p_id uuid,p_link_id uuid,p_occurred_at timestamptz,p_metadata jsonb) returns void language plpgsql security definer set search_path = '' as $$
 declare added integer;
 begin
 insert into public.click_events(id,link_id,occurred_at,ip_hash,country,city,latitude,longitude,device,browser,os,referrer_domain,is_bot)
 values(p_id,p_link_id,p_occurred_at,p_metadata->>'ip_hash',coalesce(left(p_metadata->>'country',100),'Unknown'),coalesce(left(p_metadata->>'city',200),'Unknown'),
 (p_metadata->>'latitude')::double precision,(p_metadata->>'longitude')::double precision,
 coalesce(left(p_metadata->>'device',40),'Unknown'),coalesce(left(p_metadata->>'browser',40),'Unknown'),coalesce(left(p_metadata->>'os',40),'Unknown'),
 coalesce(left(p_metadata->>'referrer_domain',253),'Direct / Unknown'),coalesce((p_metadata->>'is_bot')::boolean,false)) on conflict(id) do nothing;
 get diagnostics added = row_count;
 if added=1 then update public.links set lifetime_count=lifetime_count+1,last_click_at=greatest(last_click_at,p_occurred_at) where id=p_link_id; end if;
 end;
$$;
revoke all on function public.resolve_link(text),public.record_click(uuid,uuid,timestamptz,jsonb) from public,anon,authenticated;
grant execute on function public.resolve_link(text),public.record_click(uuid,uuid,timestamptz,jsonb) to links_runtime;
create function public.link_directory(p_search text default '',p_status text default 'active',p_source text default 'all',p_sort text default 'created',p_direction text default 'desc',p_page integer default 1,p_size integer default 25,p_export boolean default false) returns jsonb language plpgsql stable security invoker set search_path = '' as $$
 declare result jsonb;
 begin
 if not public.is_link_owner() then raise insufficient_privilege; end if;
 if p_status not in ('active','deleted','all') or p_source not in ('native','migrated','all') or p_sort not in ('created','slug','title','clicks','last_click') or p_direction not in ('asc','desc') or p_size not in (25,50,100,200,500) or p_page<1 or p_page>1000000 then raise exception 'invalid directory parameters'; end if;
 with filtered as (select * from public.links l where
 (p_status='all' or (p_status='active' and deleted_at is null) or (p_status='deleted' and deleted_at is not null))
 and (p_source='all' or source=p_source)
 and (p_search='' or strpos(lower(slug),lower(p_search))>0 or strpos(lower(destination),lower(p_search))>0 or strpos(lower(coalesce(title,'')),lower(p_search))>0)),
 ordered as (select * from filtered order by
 case when p_sort='slug' and p_direction='asc' then slug end asc,case when p_sort='slug' and p_direction='desc' then slug end desc,
 case when p_sort='title' and p_direction='asc' then title end asc nulls last,case when p_sort='title' and p_direction='desc' then title end desc nulls last,
 case when p_sort='created' and p_direction='asc' then created_at end asc,case when p_sort='created' and p_direction='desc' then created_at end desc,
 case when p_sort='clicks' and p_direction='asc' then lifetime_count end asc,case when p_sort='clicks' and p_direction='desc' then lifetime_count end desc,
 case when p_sort='last_click' and p_direction='asc' then last_click_at end asc nulls last,case when p_sort='last_click' and p_direction='desc' then last_click_at end desc nulls last,id),
 paged as(select * from ordered limit case when p_export then null else p_size end offset case when p_export then 0 else (p_page-1)*p_size end)
 select jsonb_build_object('total',(select count(*) from filtered),'rows',coalesce((select jsonb_agg(to_jsonb(paged)) from paged),'[]'::jsonb)) into result;
 return result;
 end;
$$;
create function public.link_summary() returns jsonb language plpgsql stable security invoker set search_path = '' as $$
 begin
 if not public.is_link_owner() then raise insufficient_privilege; end if;
 return (select jsonb_build_object('total',count(*),'active',count(*) filter(where deleted_at is null),'deleted',count(*) filter(where deleted_at is not null),
 'native',count(*) filter(where source='native'),'migrated',count(*) filter(where source='migrated'),'clicks',coalesce(sum(lifetime_count),0),
 'top',coalesce((select jsonb_agg(to_jsonb(t)) from (select * from public.links where deleted_at is null order by lifetime_count desc,id limit 5)t),'[]'::jsonb),
 'recent',coalesce((select jsonb_agg(to_jsonb(t)) from (select * from public.links where last_click_at is not null order by last_click_at desc,id limit 5)t),'[]'::jsonb)) from public.links);
 end;
$$;
create function public.link_analytics(p_link_id uuid,p_range text default '7d',p_end timestamptz default now(),p_page integer default 1,p_size integer default 50) returns jsonb language plpgsql stable security invoker set search_path = '' as $$
 declare duration interval; start_at timestamptz; bucket text; result jsonb;
 begin
 if not public.is_link_owner() then raise insufficient_privilege; end if;
 if p_range not in ('24h','7d','30d','90d','all') or p_page<1 or p_page>1000000 or p_size not in (25,50,100,200,500) then raise exception 'invalid analytics parameters'; end if;
 if not exists(select 1 from public.links where id=p_link_id) then raise exception 'link not found'; end if;
 duration=case p_range when '24h' then interval '24 hours' when '7d' then interval '7 days' when '30d' then interval '30 days' when '90d' then interval '90 days' else null end;
 start_at=case when duration is null then '-infinity'::timestamptz else p_end-duration end;
 bucket=case when p_range='24h' then 'hour' else 'day' end;
 with period as materialized(select * from public.click_events where link_id=p_link_id and occurred_at>=start_at and occurred_at<p_end),
 trends as(select date_trunc(bucket,occurred_at at time zone 'Asia/Kolkata') as interval,count(*) as clicks from period group by 1),
 series as(select s as interval,coalesce(t.clicks,0) as clicks from generate_series(
 date_trunc(bucket,case when duration is null then coalesce((select min(occurred_at) from period),p_end) else start_at end at time zone 'Asia/Kolkata'),
 date_trunc(bucket,(p_end-interval '1 microsecond') at time zone 'Asia/Kolkata'),case when bucket='hour' then interval '1 hour' else interval '1 day' end)s left join trends t on t.interval=s),
 dimensions as(select key,value,count(*) clicks from period e cross join lateral (values('country',e.country),('city',e.city || ' · ' || e.country),('device',e.device),('browser',e.browser),('os',e.os),('referrer',e.referrer_domain))d(key,value) group by key,value),
 heat as(select extract(dow from occurred_at at time zone 'Asia/Kolkata') as day,extract(hour from occurred_at at time zone 'Asia/Kolkata') as hour,count(*) clicks from period group by 1,2),
 geography as(select country,avg(latitude) as latitude,avg(longitude) as longitude,count(*) clicks from period group by country),
 events as(select id,occurred_at,country,city,device,browser,os,referrer_domain,is_bot from period order by occurred_at desc,id limit p_size offset (p_page-1)*p_size)
 select jsonb_build_object('clicks',(select count(*) from period),'unique',(select count(distinct ip_hash) from period),'bots',(select count(*) from period where is_bot),
 'prior',case when duration is null then null else (select count(*) from public.click_events where link_id=p_link_id and occurred_at>=start_at-duration and occurred_at<start_at) end,
 'lifetime',(select lifetime_count from public.links where id=p_link_id),'lastClick',(select last_click_at from public.links where id=p_link_id),
 'trends',coalesce((select jsonb_agg(to_jsonb(series) order by interval) from series),'[]'::jsonb),
 'peak',(select to_jsonb(t) from trends t order by clicks desc,interval limit 1),
 'dimensions',coalesce((select jsonb_agg(to_jsonb(dimensions) order by key,clicks desc,value) from dimensions),'[]'::jsonb),
 'heatmap',coalesce((select jsonb_agg(to_jsonb(heat) order by day,hour) from heat),'[]'::jsonb),
 'geography',coalesce((select jsonb_agg(to_jsonb(geography) order by clicks desc,country) from geography),'[]'::jsonb),
 'events',coalesce((select jsonb_agg(to_jsonb(events) order by occurred_at desc,id) from events),'[]'::jsonb),'page',p_page,'size',p_size,'end',p_end,'start',case when duration is null then null else start_at end) into result;
 return result;
 end;
$$;
revoke all on function public.link_directory(text,text,text,text,text,integer,integer,boolean),public.link_summary(),public.link_analytics(uuid,text,timestamptz,integer,integer) from public,anon,links_runtime;
grant execute on function public.link_directory(text,text,text,text,text,integer,integer,boolean),public.link_summary(),public.link_analytics(uuid,text,timestamptz,integer,integer) to authenticated;
-- Other default public schema functions must not confer access to the restricted role.
revoke execute on function public.valid_link_slug(text) from public;
grant execute on function public.valid_link_slug(text) to authenticated;
commit;
