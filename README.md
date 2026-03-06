# HEMLY MVP

Production-oriented MVP for a Swedish housing marketplace built with Next.js, Supabase, and Vercel.

## Architecture Plan

### System design
- Frontend: Next.js App Router + React + TypeScript + TailwindCSS.
- Backend: Next.js route handlers (`app/api/*`) with validation and rate limiting.
- Database/Auth/Storage: Supabase Postgres, Supabase Auth, Supabase Storage (`property-images`).
- Maps: Mapbox (`react-map-gl`) with markers and clustering.
- Deployment: GitHub + Vercel auto deploy.
- CI: GitHub Actions (`lint`, `test`, `build`).

### Core domains
- Public marketplace search with pagination.
- Affordability wizard (income + savings -> max price/monthly estimate).
- SEO location routes and dynamic metadata.
- Property detail page with gallery, monthly cost, mortgage calculator, and lead form.
- User favorites and search profiles (alerts).
- Agent listing submission (pending moderation).
- Admin moderation workflow (approve/reject).
- Listing imports (CSV/XML/JSON) + adapter architecture (Vitec/Fasad/Mspecs).

### Security
- Supabase Row Level Security policies.
- Input validation using Zod.
- Basic API rate limiting in route handlers.

## Repository Structure

```txt
/hemly
  /app
  /components
  /lib
  /hooks
  /styles
  /api
  /supabase
    /migrations
    /seed
  /scripts
    /import
  README.md
```

## Local Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_MAPBOX_TOKEN=
MAPBOX_TOKEN=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

3. Run Supabase migration + seed:
```bash
# Use Supabase CLI in your environment, then:
# supabase db push
# psql ... -f supabase/seed/seed.sql
```

4. Start app:
```bash
npm run dev
```

## Import Scripts

- CSV import:
```bash
npm run import:csv -- ./data/feed.csv
```

- XML import:
```bash
npm run import:xml -- ./data/feed.xml
```

- JSON import:
```bash
npm run import:json -- ./data/feed.json
```

## Deployment (GitHub + Vercel)

1. Push repository to GitHub.
2. Import project into Vercel and connect GitHub repo.
3. Set environment variables in Vercel:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `MAPBOX_TOKEN`
- `NEXT_PUBLIC_MAPBOX_TOKEN`
- `NEXT_PUBLIC_SITE_URL`
- `SUPABASE_SERVICE_ROLE_KEY` (server-only)
4. Every push to main triggers:
- GitHub Actions CI (`lint`, `test`, `build`)
- Vercel automatic deployment.

## Notes

- Listing status flow: `pending -> approved/rejected` by admin.
- Property images are stored in Supabase Storage bucket `property-images`.
- Alerts endpoint exists at `POST /api/alerts/run` and is ready to connect to email provider (Resend/SMTP).
