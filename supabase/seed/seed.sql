-- Seed demo agents
insert into public.agents (id, name, company, email, phone)
values
  ('11111111-1111-1111-1111-111111111111', 'Anna Berg', 'Nordic Homes', 'anna@nordichomes.se', '+46 70 123 45 67'),
  ('22222222-2222-2222-2222-222222222222', 'Erik Svensson', 'City Living', 'erik@cityliving.se', '+46 70 987 65 43'),
  ('33333333-3333-3333-3333-333333333333', 'Sara Lind', 'BoSmart', 'sara@bosmart.se', '+46 70 321 45 67')
on conflict (id) do nothing;

with generated as (
  select
    gs as n,
    case
      when gs % 4 = 0 then 'Stockholm'
      when gs % 4 = 1 then 'Göteborg'
      when gs % 4 = 2 then 'Malmö'
      else 'Uppsala'
    end as city,
    case
      when gs % 4 = 0 then (array['Vasastan','Södermalm','Östermalm','Kungsholmen'])[1 + (gs % 4)]
      when gs % 4 = 1 then (array['Linné','Haga','Majorna','Centrum'])[1 + (gs % 4)]
      when gs % 4 = 2 then (array['Västra Hamnen','Möllevången','Limhamn','Centrum'])[1 + (gs % 4)]
      else (array['Luthagen','Kungsängen','Fålhagen','Centrum'])[1 + (gs % 4)]
    end as area,
    case when gs % 4 = 0 then 59.33 when gs % 4 = 1 then 57.70 when gs % 4 = 2 then 55.60 else 59.86 end + ((random() - 0.5) * 0.07) as lat,
    case when gs % 4 = 0 then 18.06 when gs % 4 = 1 then 11.97 when gs % 4 = 2 then 13.00 else 17.64 end + ((random() - 0.5) * 0.07) as lng,
    (2800000 + (random() * 7200000)::int) as price,
    (1800 + (random() * 6800)::int) as monthly_fee,
    (35 + (random() * 175)::int) as size,
    round((1 + random() * 6)::numeric, 1) as rooms,
    (array['villa','apartment','townhouse','cottage'])[1 + (gs % 4)]::property_type as property_type,
    (array[
      'Bright home with balcony and excellent local transit.',
      'Renovated home with open kitchen and social floorplan.',
      'Family-friendly area near schools and green parks.',
      'Move-in ready home with modern finishes and storage.'
    ])[1 + (gs % 4)] as description
  from generate_series(1, 300) gs
), inserted as (
  insert into public.properties (
    title,
    description,
    price,
    monthly_fee,
    size,
    rooms,
    property_type,
    year_built,
    city,
    area,
    address,
    latitude,
    longitude,
    slug,
    agent_id,
    status,
    monthly_cost_estimate
  )
  select
    format('%s %s rum, %s kvm', city, rooms, size),
    description,
    price,
    monthly_fee,
    size,
    rooms,
    property_type,
    1960 + (random() * 65)::int,
    city,
    area,
    format('Gata %s', n),
    lat,
    lng,
    lower(replace(format('%s-%s-%s', city, area, n), ' ', '-')),
    (array['11111111-1111-1111-1111-111111111111','22222222-2222-2222-2222-222222222222','33333333-3333-3333-3333-333333333333'])[1 + (n % 3)]::uuid,
    'approved'::listing_status,
    round((price * 0.0035 + monthly_fee)::numeric)::int
  from generated
  on conflict (slug) do nothing
  returning id
)
insert into public.property_images (property_id, url, image_order)
select
  i.id,
  format('https://picsum.photos/seed/hemly-sql-%s/1200/800', row_number() over (order by i.id)),
  0
from inserted i;
