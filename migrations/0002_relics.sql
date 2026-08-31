create table if not exists relics (
  id         text primary key,
  href       text not null unique,
  created_at timestamptz not null default now()
);
create index if not exists relics_created_at_idx on relics (created_at desc);
