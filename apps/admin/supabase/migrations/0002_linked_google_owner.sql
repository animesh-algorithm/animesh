begin;
-- The primary provider describes account creation. Linked Google accounts
-- advertise Google in the server-controlled providers array instead.
create or replace function public.is_link_owner() returns boolean
language sql stable security definer set search_path = '' as $$
 select exists(select 1 from private.owner_config c
 where c.user_id = auth.uid()
 and c.email = lower(auth.jwt()->>'email')
 and (
   auth.jwt()->'app_metadata'->>'provider' = 'google'
   or auth.jwt()->'app_metadata'->'providers' @> '["google"]'::jsonb
 ));
$$;
revoke all on function public.is_link_owner() from public;
grant execute on function public.is_link_owner() to authenticated;
commit;
