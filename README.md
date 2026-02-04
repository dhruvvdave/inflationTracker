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

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- FRED API key (free from https://fred.stlouisfed.org/docs/api/api_key.html)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/inflationTracker.git
   cd inflationTracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your configuration:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `FRED_API_KEY`: Your FRED API key
   - `NEXT_PUBLIC_BASE_URL`: Your application URL (http://localhost:3000 for local development)

4. **Set up the database**
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

5. **Fetch CPI data**
   ```bash
   npm run refresh:cpi
   ```
   
   This will fetch the latest CPI data from FRED for multiple series including:
   - CPIAUCSL (All items)
   - CPIUFDSL (Food)
   - CPIENGSL (Energy)
   - CPIMEDSL (Medical care)
   - CPITRNSL (Transportation)
   - CPIHOSSL (Housing)

6. **Run the development server**
   ```bash
   npm run dev
   ```
   
   Open [http://localhost:3000](http://localhost:3000) in your browser.

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
