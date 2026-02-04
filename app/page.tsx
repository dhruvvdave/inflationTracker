import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-slate-50 mb-4">InflationLens</h1>
        <p className="text-xl text-slate-400 mb-8 max-w-2xl">
          Track your personal inflation rate using your own spending basket
        </p>
        <div className="flex gap-4 justify-center">
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
            View dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
