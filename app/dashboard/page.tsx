import Link from 'next/link';
import KPICard from '@/components/KPICard';
import LineChart from '@/components/LineChart';
import { isDatabaseConfigured, prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

interface DashboardPageProps {
  searchParams: Promise<{ basketId?: string }>;
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const { basketId } = await searchParams;

  if (!isDatabaseConfigured || !prisma) {
    return (
      <main className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
        <div className="text-center max-w-lg">
          <h1 className="text-3xl font-bold text-slate-50 mb-4">Database Setup Required</h1>
          <p className="text-slate-400 mb-6">Configure DATABASE_URL and import CPI data before opening dashboards.</p>
          <Link href="/" className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3 rounded-lg">
            Back to home
          </Link>
        </div>
      </main>
    );
  }

  if (!basketId) {
    const baskets = await prisma.basket.findMany({ orderBy: { createdAt: 'desc' } });

    return (
      <main className="min-h-screen bg-slate-950 py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <Link href="/" className="text-emerald-500 hover:text-emerald-400">
              ← Back to home
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-slate-50 mb-3">Choose a basket</h1>
          <p className="text-slate-400 mb-6">Select the basket you want to analyze.</p>

          {baskets.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
              <p className="text-slate-300 mb-4">No baskets found. Create one first.</p>
              <Link href="/basket" className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-5 py-2 rounded-lg inline-block">
                Go to basket manager
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {baskets.map((basket) => (
                <Link
                  key={basket.id}
                  href={`/dashboard?basketId=${basket.id}`}
                  className="block bg-slate-900 border border-slate-800 rounded-lg p-4 hover:border-emerald-700"
                >
                  <p className="text-slate-100 font-semibold">{basket.name}</p>
                  <p className="text-slate-400 text-sm">Created {new Date(basket.createdAt).toLocaleDateString()}</p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    );
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const response = await fetch(`${baseUrl}/api/compute?basketId=${basketId}`, {
    cache: 'no-store',
  });

  if (!response.ok) {
    return (
      <main className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-50 mb-4">Error</h1>
          <p className="text-slate-400 mb-6">Failed to load dashboard data. Verify CPI data has been imported.</p>
          <Link href="/basket" className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3 rounded-lg">
            Manage Baskets
          </Link>
        </div>
      </main>
    );
  }

  const data = await response.json();
  const { basket, timeline, kpis, drivers } = data;

  const formatPercent = (value: number | null) => (value === null ? 'N/A' : `${(value * 100).toFixed(2)}%`);

  return (
    <main className="min-h-screen bg-slate-950 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <Link href="/basket" className="text-emerald-500 hover:text-emerald-400">
            ← Manage baskets
          </Link>
          <Link href="/dashboard" className="text-slate-300 hover:text-white text-sm">
            Switch basket
          </Link>
        </div>

        <h1 className="text-4xl font-bold text-slate-50 mb-2">{basket.name}</h1>
        <p className="text-slate-400 mb-8">Personal Inflation Dashboard</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <KPICard label="Personal YoY" value={kpis.personalYoY} format={formatPercent} />
          <KPICard label="Personal MoM" value={kpis.personalMoM} format={formatPercent} />
          <KPICard label="National YoY" value={kpis.nationalYoY} format={formatPercent} />
          <KPICard label="National MoM" value={kpis.nationalMoM} format={formatPercent} />
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-50 mb-4">Inflation Timeline</h2>
          <LineChart data={timeline} />
        </div>

        <div>
          <h2 className="text-2xl font-bold text-slate-50 mb-4">Top Category Drivers (12mo)</h2>
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
            {drivers.length === 0 ? (
              <p className="text-slate-400">Not enough data to calculate drivers.</p>
            ) : (
              <div className="space-y-3">
                {drivers.map((driver: any, idx: number) => (
                  <div key={idx} className="flex justify-between items-center">
                    <span className="text-slate-300">{driver.category}</span>
                    <span className="text-slate-50 font-semibold">{(driver.contribution * 100).toFixed(2)}%</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
