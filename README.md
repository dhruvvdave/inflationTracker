# InflationLens — Personal Inflation Tracker

InflationLens is a Next.js + PostgreSQL app for measuring **your own inflation rate** using a custom weighted basket of CPI components, then comparing it against national CPI.

## What’s improved

- Better app flow: clear landing page, basket picker on dashboard, and stronger empty/error states.
- Safer basket builder UX: validated weight totals + guided CPI series selection.
- Basket lifecycle support: create, view, and delete baskets from the UI.
- Deployment guidance: practical hosting paths with recommended stack.

---

## Quick start (local)

### 1) Install dependencies

```bash
npm install
```

### 2) Configure environment

```bash
cp .env.example .env
```

Update `.env`:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/inflationlens"
FRED_API_KEY="your_fred_api_key"
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

### 3) Start PostgreSQL

Easiest path:

```bash
docker-compose up -d
```

### 4) Apply schema and verify DB

```bash
npx prisma generate
npx prisma migrate dev
npm run setup:db
```

### 5) Import CPI data from FRED

```bash
npm run refresh:cpi
```

### 6) Run the app

```bash
npm run dev
```

Open http://localhost:3000.

---

## App usage

1. Go to **/basket**.
2. Create a basket with category weights that sum to **1.0**.
3. Open **/dashboard** and select your basket.
4. Review Personal vs National CPI KPIs and timeline.

---

## Hosting options (and what to choose)

### Should this stay only on GitHub?

- **GitHub only** is fine if you just want source control and collaboration.
- If you want non-technical users to actually use it, **host it**.

### Recommended production setup

- **Frontend/API:** Vercel (simple Next.js deployment)
- **Database:** Neon or Supabase Postgres
- **Secrets:** Vercel environment variables
- **Scheduled CPI refresh:** Vercel Cron job (or GitHub Actions cron)

This gives the best balance of simplicity + reliability for this project.

### Deployment checklist (Vercel + managed Postgres)

1. Push this repo to GitHub.
2. Create managed Postgres (Neon/Supabase) and copy connection string.
3. Import repo into Vercel.
4. Set env vars in Vercel:
   - `DATABASE_URL`
   - `FRED_API_KEY`
   - `NEXT_PUBLIC_BASE_URL` (your deployed URL)
5. Run migrations:
   - either in CI/CD,
   - or once locally against production DB:
     ```bash
     npx prisma migrate deploy
     ```
6. Seed/refresh CPI data:
   ```bash
   npm run refresh:cpi
   ```
7. Optional automation: schedule monthly refresh via Cron/Actions.

---

## Useful commands

```bash
npm run dev          # start dev server
npm run build        # production build
npm run start        # run production build
npm run test         # run unit tests
npm run refresh:cpi  # import/update CPI data from FRED
npm run setup:db     # DB diagnostics
npm run db:studio    # Prisma Studio
```

---

## Troubleshooting

- If basket/dashboard pages show setup errors, verify `DATABASE_URL` and DB reachability.
- If metrics look empty, ensure CPI data has been imported (`npm run refresh:cpi`).
- If API calls fail in deployed env, confirm `NEXT_PUBLIC_BASE_URL` is set to deployed domain.
