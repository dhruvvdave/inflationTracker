import BasketEditor from '@/components/BasketEditor';
import { prisma } from '@/lib/db';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function BasketPage() {
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

        <h1 className="text-4xl font-bold text-slate-50 mb-8">Manage Baskets</h1>

        <div className="mb-8">
          <BasketEditor />
        </div>

        <div>
          <h2 className="text-2xl font-bold text-slate-50 mb-4">Your Baskets</h2>
          {baskets.length === 0 ? (
            <p className="text-slate-400">No baskets yet. Create one above!</p>
          ) : (
            <div className="grid gap-4">
              {baskets.map((basket) => (
                <div
                  key={basket.id}
                  className="bg-slate-900 border border-slate-800 rounded-lg p-4"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-semibold text-slate-50 mb-2">
                        {basket.name}
                      </h3>
                      <p className="text-slate-400 text-sm mb-2">
                        {basket.items.length} items • Created{' '}
                        {new Date(basket.createdAt).toLocaleDateString()}
                      </p>
                      <div className="space-y-1">
                        {basket.items.map((item) => (
                          <div key={item.id} className="text-sm text-slate-300">
                            {item.category}: {(item.weight * 100).toFixed(1)}% ({item.seriesId})
                          </div>
                        ))}
                      </div>
                    </div>
                    <Link
                      href={`/dashboard?basketId=${basket.id}`}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded text-sm"
                    >
                      View
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
