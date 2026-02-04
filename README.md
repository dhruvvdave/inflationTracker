# InflationLens — Personal Inflation Tracker

A full-stack web application that allows users to track their personal inflation rate using custom spending baskets and compare it to national CPI data from the FRED API.

## Features

- **Personal vs National Inflation**: Track your personal inflation rate based on your actual spending patterns and compare it to the national CPI
- **Custom Baskets**: Create custom spending baskets with weighted categories that reflect your actual expenses
- **Time-Series Dashboard**: Visualize inflation trends over time with interactive charts
- **Automated CPI Refresh**: Fetch the latest CPI data from the Federal Reserve Economic Data (FRED) API
- **Category Drivers Analysis**: See which spending categories are contributing most to your personal inflation

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript, Tailwind CSS, Recharts
- **Backend**: Next.js API Routes, Node.js
- **Database**: PostgreSQL with Prisma ORM
- **External API**: FRED (Federal Reserve Economic Data)
- **Testing**: Jest

## Quick Start

### 1. Clone and Install

```bash
git clone https://github.com/dhruvvdave/inflationTracker.git
cd inflationTracker
npm install
```

### 2. Setup Database (Choose One Option)

#### Option A: Docker (Easiest, Recommended for Beginners)

```bash
# Start PostgreSQL in Docker
docker-compose up -d

# Create .env file with database connection
echo 'DATABASE_URL="postgresql://postgres:postgres@localhost:5432/inflationlens"' > .env
echo 'FRED_API_KEY="YOUR_FRED_KEY"' >> .env
echo 'NEXT_PUBLIC_BASE_URL="http://localhost:3000"' >> .env
```

**Verify it's running:**
```bash
docker-compose ps
```

#### Option B: Supabase (Free Cloud Database)

1. Sign up at [supabase.com](https://supabase.com)
2. Create a new project
3. Go to **Settings** → **Database**
4. Copy the **Connection String** (use **Transaction** pooling mode, not Session)
5. Create `.env` file:
   ```bash
   cp .env.example .env
   ```
6. Paste your Supabase connection string into `.env`:
   ```
   DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@[HOST]:[PORT]/postgres?sslmode=require"
   ```

#### Option C: Local PostgreSQL

**macOS:**
```bash
# Install PostgreSQL
brew install postgresql@15
brew services start postgresql@15

# Create database
createdb inflationlens

# Create .env file
echo 'DATABASE_URL="postgresql://postgres@localhost:5432/inflationlens"' > .env
echo 'FRED_API_KEY="YOUR_FRED_KEY"' >> .env
echo 'NEXT_PUBLIC_BASE_URL="http://localhost:3000"' >> .env
```

**Linux (Ubuntu/Debian):**
```bash
# Install PostgreSQL
sudo apt update
sudo apt install postgresql postgresql-contrib

# Start service
sudo systemctl start postgresql

# Create database
sudo -u postgres createdb inflationlens

# Create .env file
echo 'DATABASE_URL="postgresql://postgres@localhost:5432/inflationlens"' > .env
echo 'FRED_API_KEY="YOUR_FRED_KEY"' >> .env
echo 'NEXT_PUBLIC_BASE_URL="http://localhost:3000"' >> .env
```

**If you encounter permission errors:**
```bash
psql inflationlens
GRANT ALL PRIVILEGES ON DATABASE inflationlens TO postgres;
GRANT ALL ON SCHEMA public TO postgres;
\q
```

### 3. Setup Database Schema

```bash
# Generate Prisma Client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Verify connection
npm run setup:db
```

### 4. Get FRED API Key

1. Visit [https://fred.stlouisfed.org/docs/api/api_key.html](https://fred.stlouisfed.org/docs/api/api_key.html)
2. Request a free API key (instant approval)
3. Add it to your `.env` file:
   ```
   FRED_API_KEY="your_actual_api_key_here"
   ```

### 5. Fetch CPI Data

```bash
npm run refresh:cpi
```

This will fetch historical CPI data for various categories (Food, Energy, Medical, Transportation, Housing).

### 6. Start Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

### 7. Verify Everything Works

Test the database connection:
```bash
curl http://localhost:3000/api/health
```

Expected response:
```json
{"status":"ok","database":"connected","timestamp":"..."}
```

## Troubleshooting

If you encounter any issues during setup, see [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for common problems and solutions.

Common issues:
- Database connection errors → Run `npm run setup:db` for diagnostics
- Permission denied errors → See database permission fixes in TROUBLESHOOTING.md
- Port conflicts → Check if port 5432 or 3000 is already in use
- Missing environment variables → Ensure `.env` file exists with all required values

### Running Tests

```bash
npm test
```

## Project Structure

```
inflationTracker/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── basket/        # Basket CRUD operations
│   │   ├── cpi/           # CPI data retrieval
│   │   └── compute/       # Inflation calculations
│   ├── basket/            # Basket management page
│   ├── dashboard/         # Dashboard page
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Landing page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── BasketEditor.tsx   # Basket creation/editing
│   ├── KPICard.tsx        # KPI display card
│   └── LineChart.tsx      # Time-series chart
├── lib/                   # Core business logic
│   ├── db.ts              # Prisma client
│   ├── fred.ts            # FRED API integration
│   ├── inflation.ts       # Inflation calculations
│   └── validation.ts      # Input validation
├── prisma/                # Database schema
│   ├── schema.prisma      # Prisma schema
│   └── seed.ts            # Database seeding
├── scripts/               # Utility scripts
│   └── refreshCpi.ts      # CPI data refresh script
└── __tests__/             # Test files
    └── inflation.test.ts  # Inflation calculation tests
```

## Usage

### Creating a Basket

1. Navigate to "Build your basket"
2. Enter a name for your basket
3. Add items with:
   - Category name (e.g., "Food", "Transportation")
   - Weight (percentage of your spending, must sum to 1.0)
   - FRED Series ID (e.g., "CPIUFDSL" for food)
4. Click "Save Basket"

### Viewing Your Dashboard

1. Go to "View dashboard" or click "View" on a saved basket
2. See your personal inflation metrics:
   - Personal YoY (Year-over-Year)
   - Personal MoM (Month-over-Month)
   - National YoY and MoM for comparison
3. View the inflation timeline chart
4. Analyze which categories are driving your personal inflation

## API Endpoints

- `GET /api/basket` - List all baskets
- `POST /api/basket` - Create a new basket
- `GET /api/cpi?seriesId={id}` - Get CPI data for a series
- `GET /api/compute?basketId={id}` - Compute inflation metrics for a basket

## Development Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run lint` - Lint code
- `npm run refresh:cpi` - Refresh CPI data from FRED
- `npm run setup:db` - Check database connection and setup
- `npm run db:reset` - Reset database (⚠️ deletes all data)
- `npm run db:studio` - Open Prisma Studio (database GUI)

## Resume Entry

**InflationLens — Personal Inflation Tracker**
- Built full-stack Next.js 14 application with TypeScript to track personal inflation rates
- Integrated Federal Reserve Economic Data (FRED) API for real-time CPI data retrieval
- Implemented weighted basket calculations and time-series analysis algorithms
- Designed PostgreSQL schema with Prisma ORM for efficient data storage and retrieval
- Created responsive dark-themed UI with Tailwind CSS and Recharts for data visualization
- Achieved type-safe API routes with comprehensive input validation and error handling

## Future Enhancements

- User authentication and multi-user support
- Multiple basket comparison view
- Export data to CSV
- Vercel Cron for automated daily/weekly CPI refresh
- GitHub Actions CI/CD pipeline
- Additional FRED series integration
- Custom date range selection
- Mobile-responsive improvements

## License

MIT

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## Acknowledgments

- Federal Reserve Economic Data (FRED) for providing the CPI data API
- Next.js team for the excellent framework
- Prisma team for the powerful ORM
