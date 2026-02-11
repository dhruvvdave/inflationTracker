'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface BasketItem {
  id: string;
  category: string;
  weight: number;
  seriesId: string;
}

interface Basket {
  id: string;
  name: string;
  createdAt: string | Date;
  items: BasketItem[];
}

interface BasketListProps {
  baskets: Basket[];
}

export default function BasketList({ baskets }: BasketListProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this basket? This cannot be undone.')) {
      return;
    }

    setDeletingId(id);
    try {
      const response = await fetch(`/api/basket?id=${id}`, { method: 'DELETE' });
      if (!response.ok) {
        const payload = await response.json();
        throw new Error(payload.error ?? 'Failed to delete basket');
      }
      router.refresh();
    } catch (error: any) {
      alert(error.message || 'Failed to delete basket');
    } finally {
      setDeletingId(null);
    }
  };

  if (!baskets.length) {
    return <p className="text-slate-400">No baskets yet. Create one above to get started.</p>;
  }

  return (
    <div className="grid gap-4">
      {baskets.map((basket) => (
        <div key={basket.id} className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <div className="flex justify-between items-start gap-4">
            <div>
              <h3 className="text-xl font-semibold text-slate-50 mb-2">{basket.name}</h3>
              <p className="text-slate-400 text-sm mb-2">
                {basket.items.length} items • Created {new Date(basket.createdAt).toLocaleDateString()}
              </p>
              <div className="space-y-1">
                {basket.items.map((item) => (
                  <div key={item.id} className="text-sm text-slate-300">
                    {item.category}: {(item.weight * 100).toFixed(1)}% ({item.seriesId})
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Link
                href={`/dashboard?basketId=${basket.id}`}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded text-sm text-center"
              >
                View
              </Link>
              <button
                type="button"
                onClick={() => handleDelete(basket.id)}
                disabled={deletingId === basket.id}
                className="bg-red-700 hover:bg-red-800 disabled:bg-slate-700 text-white px-4 py-2 rounded text-sm"
              >
                {deletingId === basket.id ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
