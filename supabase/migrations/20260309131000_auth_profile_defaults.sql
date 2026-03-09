alter table public.users
add column if not exists monthly_income integer check (monthly_income is null or monthly_income >= 0),
add column if not exists savings integer check (savings is null or savings >= 0),
add column if not exists preferred_down_payment integer check (preferred_down_payment is null or preferred_down_payment >= 0);

alter table public.search_profiles
add column if not exists is_default boolean not null default false;

create unique index if not exists idx_search_profiles_one_default_per_user
on public.search_profiles(user_id)
where is_default = true;

with ranked as (
  select id, user_id, row_number() over (partition by user_id order by created_at asc, id asc) as rn
  from public.search_profiles
)
update public.search_profiles sp
set is_default = (ranked.rn = 1)
from ranked
where sp.id = ranked.id;
