alter table public.properties
add column if not exists operating_cost integer not null default 0 check (operating_cost >= 0);

update public.properties
set monthly_cost_estimate = round((price * 0.0035 + monthly_fee + operating_cost)::numeric)::int
where monthly_cost_estimate is not null;
