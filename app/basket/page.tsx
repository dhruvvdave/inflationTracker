import BasketEditor from '@/components/BasketEditor';
import BasketList from '@/components/BasketList';
import { isDatabaseConfigured, prisma } from '@/lib/db';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function BasketPage() {
  if (!isDatabaseConfigured || !prisma) {
    return (
      <main className="min-h-screen bg-slate-950 py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <Link href="/" className="text-emerald-500 hover:text-emerald-400">
              ← Back to home
            </Link>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
            <h1 className="text-3xl font-bold text-slate-50 mb-3">Database Setup Required</h1>
            <p className="text-slate-300 mb-4">
              The basket manager needs a database connection. Set <code>DATABASE_URL</code> in your <code>.env</code>{' '}
              file and run the setup script.
            </p>
            <div className="bg-slate-950 border border-slate-800 rounded-md p-4 text-slate-200 text-sm">
              <p className="mb-2">Quick setup:</p>
              <ul className="list-disc list-inside space-y-1 text-slate-300">
                <li>Copy <code>.env.example</code> to <code>.env</code></li>
                <li>Add your <code>DATABASE_URL</code></li>
                <li>Run <code>npm run setup:db</code></li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const baskets = await prisma.basket.findMany({
    include: {
      items: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <main className="min-h-screen bg-slate-950 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Link href="/" className="text-emerald-500 hover:text-emerald-400">
            ← Back to home
          </Link>
        </div>

        <h1 className="text-4xl font-bold text-slate-50 mb-2">Manage Baskets</h1>
        <p className="text-slate-400 mb-8">Create, view, and remove spending baskets for personal inflation tracking.</p>

        <div className="mb-8">
          <BasketEditor />
        </div>

        <div>
          <h2 className="text-2xl font-bold text-slate-50 mb-4">Your Baskets</h2>
          <BasketList baskets={baskets} />
        </div>
      </div>
    </main>
  );
}
