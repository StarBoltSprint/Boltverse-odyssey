alter table relics add column if not exists plays integer not null default 0;
alter table relics add column if not exists last_land timestamptz;
