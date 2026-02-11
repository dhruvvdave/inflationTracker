import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-slate-50 mb-4">InflationLens</h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Build your own weighted CPI basket, track your personal inflation over time, and compare it against national CPI.
          </p>
        </div>

        <div className="flex flex-wrap gap-4 justify-center mb-12">
          <Link
            href="/basket"
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3 rounded-lg"
          >
            Build your basket
          </Link>
          <Link
            href="/dashboard"
            className="bg-slate-800 hover:bg-slate-700 text-white font-semibold px-6 py-3 rounded-lg"
          >
            Open dashboard
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-10">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <h2 className="font-semibold text-slate-100 mb-2">1) Create a basket</h2>
            <p className="text-slate-400 text-sm">Add categories with weights that sum to 1.0 and map each to a CPI series.</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <h2 className="font-semibold text-slate-100 mb-2">2) Refresh CPI data</h2>
            <p className="text-slate-400 text-sm">Use the bundled script to import monthly CPI series from FRED into Postgres.</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <h2 className="font-semibold text-slate-100 mb-2">3) Analyze trends</h2>
            <p className="text-slate-400 text-sm">See MoM/YoY KPIs, compare against national CPI, and inspect top category drivers.</p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-sm text-slate-300">
          Need deployment help? See the Hosting section in <code>README.md</code> for Vercel + managed Postgres setup.
        </div>
      </div>
    </main>
  );
}
