import { PGlite } from "@electric-sql/pglite";
import { readFileSync } from "node:fs";
import { beforeAll, afterAll, describe, it, expect } from "vitest";
import type { Analytics, Directory, Summary } from "../lib/types";
import { linksCsv } from "../lib/csv";
let db: PGlite;
const owner = "11111111-1111-4111-8111-111111111111",
  linkId = "22222222-2222-4222-8222-222222222222",
  end = "2026-09-17T12:00:00Z";
async function claims(
  id = owner,
  email = "owner@example.com",
  provider = "google",
  providers?: string[],
) {
  await db.exec("reset role");
  await db.query("select set_config('request.jwt.claims',$1,false)", [
    JSON.stringify({ sub: id, email, app_metadata: { provider, providers } }),
  ]);
  await db.exec("set role authenticated");
}
async function analytics(range = "7d", page = 1, size = 50) {
  return (
    await db.query<{ result: Analytics }>(
      "select public.link_analytics($1,$2,$3,$4,$5) result",
      [linkId, range, end, page, size],
    )
  ).rows[0].result;
}
async function directory(
  status = "all",
  source = "all",
  search = "",
  page = 1,
  size = 25,
  exportAll = false,
) {
  return (
    await db.query<{ result: Directory }>(
      "select public.link_directory($1,$2,$3,$4,$5,$6,$7,$8) result",
      [search, status, source, "slug", "asc", page, size, exportAll],
    )
  ).rows[0].result;
}
beforeAll(async () => {
  db = new PGlite();
  await db.exec(`create role anon;create role authenticated;create schema auth;
 create function auth.jwt() returns jsonb language sql stable as $$ select coalesce(nullif(current_setting('request.jwt.claims',true),''),'{}')::jsonb $$;
 create function auth.uid() returns uuid language sql stable as $$ select (auth.jwt()->>'sub')::uuid $$;
 grant usage on schema auth to authenticated;grant execute on all functions in schema auth to authenticated;`);
  await db.exec(
    readFileSync(
      new URL("../supabase/migrations/0001_links.sql", import.meta.url),
      "utf8",
    ),
  );
  await db.exec(readFileSync(new URL("../supabase/migrations/0002_linked_google_owner.sql", import.meta.url), "utf8"));
  await claims();
  expect(
    (
      await db.query<{ allowed: boolean }>(
        "select public.is_link_owner() allowed",
      )
    ).rows[0].allowed,
  ).toBe(false);
  await expect(db.query("select public.link_summary()")).rejects.toThrow();
  await db.exec("reset role");
  await db.query("insert into private.owner_config values(true,$1,$2)", [
    owner,
    "owner@example.com",
  ]);
  await db.query(
    "insert into public.links(id,slug,destination,title,creator) values($1,$2,$3,$4,$5)",
    [
      linkId,
      "Launch/notes.v1",
      "https://example.com/?owned=1#fragment",
      "Fixture link",
      owner,
    ],
  );
  await db.query(
    `insert into public.links(slug,destination,title,creator,source,migration_source_domain,deleted_at)
 select 'bulk/'||i,'https://example.com/'||i,'Fixture '||i,$1,case when i%2=0 then 'migrated' else 'native' end,case when i%2=0 then 'old.example' else null end,case when i=1201 then now() else null end from generate_series(1,1201)i`,
    [owner],
  );
  await db.query(
    `insert into public.click_events(id,link_id,occurred_at,ip_hash,country,city,device,browser,os,referrer_domain,is_bot)
 select gen_random_uuid(),$1,$2::timestamptz-interval '1 hour'-i*interval '1 minute',case when i%11=0 then null else lpad((i%10)::text,64,'a') end,
 case when i%3=0 then 'Unknown' else 'IN' end,case when i%3=0 then 'Unknown' else 'Mumbai' end,'Mobile','Chrome','Android','example.com',i%2=0 from generate_series(1,1105)i`,
    [linkId, end],
  );
  await db.query(
    `insert into public.click_events(id,link_id,occurred_at,ip_hash) values
 (gen_random_uuid(),$1,$2::timestamptz-interval '7 days',repeat('b',64)),
 (gen_random_uuid(),$1,$2::timestamptz-interval '7 days'-interval '1 microsecond',null),
 (gen_random_uuid(),$1,$2::timestamptz-interval '14 days',null),
 (gen_random_uuid(),$1,$2::timestamptz,null)`,
    [linkId, end],
  );
  await db.query(
    "update public.links set lifetime_count=(select count(*) from public.click_events where link_id=$1),last_click_at=$2 where id=$1",
    [linkId, end],
  );
  await claims();
}, 30000);
afterAll(async () => {
  await db?.close();
});
describe("PostgreSQL migrations, aggregation and privilege boundaries", () => {
  it("aggregates more than 1,000 events with exact inclusive/exclusive boundaries", async () => {
    const data = await analytics();
    expect(data.clicks).toBe(1106);
    expect(data.prior).toBe(2);
    expect(data.unique).toBe(11);
    expect(data.lifetime).toBe(1109);
    expect(data.events).toHaveLength(50);
    expect(data.bots).toBe(552);
    expect(
      data.dimensions
        .filter((d) => d.key === "country")
        .reduce((sum, d) => sum + d.clicks, 0),
    ).toBe(1106);
    expect(data.heatmap.reduce((sum, d) => sum + d.clicks, 0)).toBe(1106);
    expect(data.trends.reduce((sum, d) => sum + d.clicks, 0)).toBe(1106);
    expect(
      data.dimensions.find((d) => d.key === "country" && d.value === "Unknown")!
        .clicks,
    ).toBeGreaterThan(0);
  });
  it("uses India buckets, stable event pagination and no all-time comparison", async () => {
    const data = await analytics("24h");
    expect(data.clicks).toBe(1105);
    expect(data.prior).toBe(0);
    expect(data.trends.some((row) => row.interval.endsWith("T17:00:00"))).toBe(
      true,
    );
    const a = await analytics("7d", 1),
      b = await analytics("7d", 2);
    expect(new Set([...a.events, ...b.events].map((e) => e.id)).size).toBe(100);
    expect(JSON.stringify(a.events)).not.toContain("ip_hash");
    const all = await analytics("all");
    expect(all.prior).toBeNull();
    expect(all.clicks).toBe(1108);
  });
  it("filters, pages and exports all matching links beyond API row limits", async () => {
    const all = await directory();
    expect(all.total).toBe(1202);
    expect(all.rows).toHaveLength(25);
    const migrated = await directory("all", "migrated", "", 1, 500, true);
    expect(migrated.total).toBe(600);
    expect(migrated.rows).toHaveLength(600);
    expect(
      migrated.rows.every((l) => l.migration_source_domain === "old.example"),
    ).toBe(true);
    const exported = await directory("all", "all", "", 1, 25, true);
    expect(exported.rows).toHaveLength(1202);
    expect(linksCsv(exported.rows).split("\r\n")).toHaveLength(1204);
    const page2 = await directory("all", "all", "", 2);
    expect(new Set([...all.rows, ...page2.rows].map((l) => l.id)).size).toBe(
      50,
    );
    expect((await directory("deleted")).total).toBe(1);
    expect((await directory("all", "all", "Fixture 1201")).total).toBe(1);
    const result = (
      await db.query<{ result: Summary }>("select public.link_summary() result")
    ).rows[0].result;
    expect(result.total).toBe(1202);
    expect(result.top).toHaveLength(5);
    expect(result.recent).toHaveLength(1);
  });
  it("denies other users and non-Google claims at the database boundary", async () => {
    await claims("99999999-9999-4999-8999-999999999999", "other@example.com");
    expect((await db.query("select * from public.links")).rows).toHaveLength(0);
    await expect(db.query("select public.link_summary()")).rejects.toThrow();
    await expect(
      db.query(
        "insert into public.links(slug,destination,creator) values('forbidden','https://example.com',$1)",
        [owner],
      ),
    ).rejects.toThrow();
    await claims(owner, "owner@example.com", "email");
    expect((await db.query("select * from public.links")).rows).toHaveLength(0);
    await claims(owner, "owner@example.com", "email", ["email", "google"]);
    expect((await db.query("select * from public.links")).rows).toHaveLength(1202);
    await claims("99999999-9999-4999-8999-999999999999", "owner@example.com", "email", ["google"]);
    expect((await db.query("select * from public.links")).rows).toHaveLength(0);
    await claims();
  });
  it("lets runtime resolve/record only, with idempotent atomic count updates", async () => {
    await db.exec("reset role; set role links_runtime");
    await expect(db.query("select * from public.links")).rejects.toThrow();
    await expect(
      db.query("select * from public.click_events"),
    ).rejects.toThrow();
    await expect(
      db.query("select * from private.owner_config"),
    ).rejects.toThrow();
    await expect(db.query("select public.link_summary()")).rejects.toThrow();
    await expect(
      db.query("update public.links set title='bad' where id=$1", [linkId]),
    ).rejects.toThrow();
    const resolved = (
      await db.query<{ id: string; destination: string; deleted: boolean }>(
        "select * from public.resolve_link('Launch/notes.v1')",
      )
    ).rows[0];
    expect(resolved.id).toBe(linkId);
    expect(resolved.deleted).toBe(false);
    const id = "33333333-3333-4333-8333-333333333333";
    for (let i = 0; i < 2; i++)
      await db.query("select public.record_click($1,$2,$3,$4)", [
        id,
        linkId,
        end,
        JSON.stringify({ ip_hash: "c".repeat(64), is_bot: true }),
      ]);
    await expect(
      db.query("select public.record_click($1,$2,$3,$4)", [
        "44444444-4444-4444-8444-444444444444",
        linkId,
        end,
        JSON.stringify({ latitude: 100 }),
      ]),
    ).rejects.toThrow();
    await claims();
    expect(
      (
        await db.query("select * from public.click_events where id=$1", [
          "44444444-4444-4444-8444-444444444444",
        ])
      ).rows,
    ).toHaveLength(0);
    const row = (
      await db.query<{ lifetime_count: number }>(
        "select lifetime_count from public.links where id=$1",
        [linkId],
      )
    ).rows[0];
    expect(Number(row.lifetime_count)).toBe(1110);
    expect(
      (await db.query("select * from public.click_events where id=$1", [id]))
        .rows,
    ).toHaveLength(1);
  });
  it("reserves deleted slugs, protects immutable fields, preserves case and resolves edits", async () => {
    await expect(
      db.query("update public.links set slug='changed' where id=$1", [linkId]),
    ).rejects.toThrow();
    await db.query(
      "update public.links set destination='https://example.com/new' where id=$1",
      [linkId],
    );
    await db.query(
      "insert into public.links(slug,destination,creator) values('launch/notes.v1','https://example.com',$1)",
      [owner],
    );
    await db.exec("reset role;set role links_runtime");
    expect(
      (
        await db.query<{ destination: string }>(
          "select * from public.resolve_link('Launch/notes.v1')",
        )
      ).rows[0].destination,
    ).toBe("https://example.com/new");
    await claims();
    await db.query("update public.links set deleted_at=now() where id=$1", [
      linkId,
    ]);
    await expect(
      db.query(
        "insert into public.links(slug,destination,creator) values('Launch/notes.v1','https://example.com',$1)",
        [owner],
      ),
    ).rejects.toThrow();
    await db.exec("reset role;set role links_runtime");
    const row = (
      await db.query<{ destination: null; deleted: boolean }>(
        "select * from public.resolve_link('Launch/notes.v1')",
      )
    ).rows[0];
    expect(row.deleted).toBe(true);
    expect(row.destination).toBeNull();
    await claims();
    expect(
      (
        await db.query("select * from public.click_events where link_id=$1", [
          linkId,
        ])
      ).rows,
    ).toHaveLength(1110);
  });
});
