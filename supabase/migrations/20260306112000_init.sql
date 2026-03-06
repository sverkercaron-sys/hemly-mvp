create extension if not exists "pgcrypto";

create type listing_status as enum ('pending', 'approved', 'rejected');
create type property_type as enum ('villa', 'apartment', 'townhouse', 'cottage');

create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  name text,
  language text default 'sv',
  created_at timestamptz not null default now()
);

create table if not exists public.agents (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  company text,
  email text not null,
  phone text,
  created_at timestamptz not null default now()
);

create table if not exists public.properties (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  price integer not null check (price > 0),
  monthly_fee integer not null default 0 check (monthly_fee >= 0),
  size numeric(8,2) not null check (size > 0),
  rooms numeric(4,1) not null check (rooms > 0),
  property_type property_type not null,
  year_built integer,
  city text not null,
  area text not null,
  address text not null,
  latitude numeric(10,7) not null,
  longitude numeric(10,7) not null,
  slug text not null unique,
  agent_id uuid references public.agents(id) on delete set null,
  status listing_status not null default 'pending',
  monthly_cost_estimate integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.property_images (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  url text not null,
  image_order integer not null default 0,
  unique(property_id, image_order)
);

create table if not exists public.favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  property_id uuid not null references public.properties(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(user_id, property_id)
);

create table if not exists public.search_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  city text not null,
  price_min integer,
  price_max integer,
  monthly_cost_max integer,
  created_at timestamptz not null default now()
);

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete set null,
  property_id uuid not null references public.properties(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.listing_imports (
  id uuid primary key default gen_random_uuid(),
  source text not null,
  external_id text not null,
  imported_at timestamptz not null default now(),
  unique(source, external_id)
);

create index if not exists idx_properties_city_area on public.properties(city, area);
create index if not exists idx_properties_status_created on public.properties(status, created_at desc);
create index if not exists idx_properties_price on public.properties(price);
create index if not exists idx_properties_monthly_cost on public.properties(monthly_cost_estimate);
create index if not exists idx_properties_location on public.properties(latitude, longitude);
create index if not exists idx_search_profiles_user on public.search_profiles(user_id);
create index if not exists idx_favorites_user on public.favorites(user_id);

create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select coalesce((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin', false);
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, email, name, language)
  values (new.id, new.email, coalesce(new.raw_user_meta_data ->> 'name', ''), 'sv')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create or replace view public.properties_with_images as
select
  p.*,
  coalesce(
    json_agg(
      json_build_object(
        'id', pi.id,
        'property_id', pi.property_id,
        'url', pi.url,
        'image_order', pi.image_order
      ) order by pi.image_order
    ) filter (where pi.id is not null),
    '[]'::json
  ) as images
from public.properties p
left join public.property_images pi on pi.property_id = p.id
group by p.id;

alter table public.users enable row level security;
alter table public.agents enable row level security;
alter table public.properties enable row level security;
alter table public.property_images enable row level security;
alter table public.favorites enable row level security;
alter table public.search_profiles enable row level security;
alter table public.leads enable row level security;
alter table public.listing_imports enable row level security;

create policy "users read own" on public.users for select using (auth.uid() = id or public.is_admin());
create policy "users update own" on public.users for update using (auth.uid() = id or public.is_admin());

create policy "agents public read" on public.agents for select using (true);
create policy "agents manage own" on public.agents for all using (auth.uid() = id or public.is_admin()) with check (auth.uid() = id or public.is_admin());

create policy "properties public approved" on public.properties for select using (status = 'approved' or auth.uid() = agent_id or public.is_admin());
create policy "properties authenticated insert" on public.properties for insert with check (auth.role() = 'authenticated' or public.is_admin());
create policy "properties authenticated update" on public.properties for update using (auth.role() = 'authenticated' or public.is_admin()) with check (auth.role() = 'authenticated' or public.is_admin());
create policy "properties admin delete" on public.properties for delete using (public.is_admin());

create policy "property_images public read" on public.property_images for select using (
  exists (
    select 1 from public.properties p
    where p.id = property_images.property_id and (p.status = 'approved' or p.agent_id = auth.uid() or public.is_admin())
  )
);
create policy "property_images agent manage" on public.property_images for all using (
  exists (
    select 1 from public.properties p
    where p.id = property_images.property_id and (p.agent_id = auth.uid() or public.is_admin())
  )
) with check (
  exists (
    select 1 from public.properties p
    where p.id = property_images.property_id and (p.agent_id = auth.uid() or public.is_admin())
  )
);

create policy "favorites own" on public.favorites for all using (auth.uid() = user_id or public.is_admin()) with check (auth.uid() = user_id or public.is_admin());

create policy "search_profiles own" on public.search_profiles for all using (auth.uid() = user_id or public.is_admin()) with check (auth.uid() = user_id or public.is_admin());

create policy "leads own read" on public.leads for select using (auth.uid() = user_id or public.is_admin());
create policy "leads create any auth" on public.leads for insert with check (auth.uid() = user_id or user_id is null);

create policy "imports admin" on public.listing_imports for all using (public.is_admin()) with check (public.is_admin());

insert into storage.buckets (id, name, public)
values ('property-images', 'property-images', true)
on conflict (id) do nothing;

create policy "property images public read"
on storage.objects for select
using (bucket_id = 'property-images');

create policy "property images auth insert"
on storage.objects for insert
with check (bucket_id = 'property-images' and auth.role() = 'authenticated');

create policy "property images auth update"
on storage.objects for update
using (bucket_id = 'property-images' and auth.role() = 'authenticated')
with check (bucket_id = 'property-images' and auth.role() = 'authenticated');

create policy "property images auth delete"
on storage.objects for delete
using (bucket_id = 'property-images' and auth.role() = 'authenticated');
