create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  property_id uuid references public.properties(id) on delete cascade,
  kind text not null default 'search_match',
  title text not null,
  body text not null,
  url text,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create unique index if not exists idx_notifications_unique_match
on public.notifications(user_id, property_id, kind)
where property_id is not null and kind = 'search_match';

create index if not exists idx_notifications_user_created
on public.notifications(user_id, created_at desc);

alter table public.notifications enable row level security;

create policy "notifications own read"
on public.notifications for select
using (auth.uid() = user_id or public.is_admin());

create policy "notifications own update"
on public.notifications for update
using (auth.uid() = user_id or public.is_admin())
with check (auth.uid() = user_id or public.is_admin());

create policy "notifications admin insert"
on public.notifications for insert
with check (public.is_admin() or auth.role() = 'service_role');
