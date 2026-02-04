'use client';

import { useState } from 'react';
import { WEIGHT_TOLERANCE } from '@/lib/constants';

interface BasketItem {
  category: string;
  weight: number;
  seriesId: string;
}

interface BasketEditorProps {
  onSaved?: () => void;
}

export default function BasketEditor({ onSaved }: BasketEditorProps) {
  const [name, setName] = useState('');
  const [items, setItems] = useState<BasketItem[]>([
    { category: '', weight: 0, seriesId: '' },
  ]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
  const weightDelta = 1 - totalWeight;
  const isWeightValid = Math.abs(weightDelta) <= WEIGHT_TOLERANCE;
  const weightStatus = isWeightValid
    ? 'Weights total 1.0'
    : weightDelta > 0
      ? `Add ${weightDelta.toFixed(4)}`
      : `Remove ${Math.abs(weightDelta).toFixed(4)}`;

  const addItem = () => {
    setItems([...items, { category: '', weight: 0, seriesId: '' }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof BasketItem, value: string | number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const handleSave = async () => {
    setError('');
    setSaving(true);

    try {
      const payload = {
        name: name.trim(),
        items: items.map((item) => ({
          category: item.category.trim(),
          weight: item.weight,
          seriesId: item.seriesId.trim().toUpperCase(),
        })),
      };

      const response = await fetch('/api/basket', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save basket');
      }

      // Reset form
      setName('');
      setItems([{ category: '', weight: 0, seriesId: '' }]);
      
      if (onSaved) {
        onSaved();
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const canSave = name.trim() !== '' && isWeightValid;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
      <h2 className="text-2xl font-bold text-slate-50 mb-4">Create New Basket</h2>

      {error && (
        <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-2 rounded mb-4">
          {error}
        </div>
      )}

      <div className="mb-4">
        <label className="block text-slate-300 mb-2">Basket Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-slate-800 border border-slate-700 text-slate-50 rounded px-3 py-2"
          placeholder="e.g., My Spending Basket"
        />
      </div>

      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <div>
            <label className="block text-slate-300">Items</label>
            <p className={`text-sm ${isWeightValid ? 'text-emerald-400' : 'text-amber-300'}`}>
              Weight sum: {totalWeight.toFixed(4)} ({weightStatus})
            </p>
          </div>
          <button
            onClick={addItem}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded text-sm"
          >
            Add Item
          </button>
        </div>

        <div className="space-y-2">
          <div className="grid grid-cols-12 gap-2 text-slate-400 text-sm">
            <div className="col-span-4">Category</div>
            <div className="col-span-3">Weight</div>
            <div className="col-span-4">Series ID</div>
            <div className="col-span-1"></div>
          </div>

          {items.map((item, index) => (
            <div key={index} className="grid grid-cols-12 gap-2">
              <input
                type="text"
                value={item.category}
                onChange={(e) => updateItem(index, 'category', e.target.value)}
                className="col-span-4 bg-slate-800 border border-slate-700 text-slate-50 rounded px-2 py-1 text-sm"
                placeholder="Food"
              />
              <input
                type="number"
                step="0.01"
                value={item.weight}
                onChange={(e) => updateItem(index, 'weight', parseFloat(e.target.value) || 0)}
                className="col-span-3 bg-slate-800 border border-slate-700 text-slate-50 rounded px-2 py-1 text-sm"
                placeholder="0.30"
              />
              <input
                type="text"
                value={item.seriesId}
                onChange={(e) => updateItem(index, 'seriesId', e.target.value)}
                className="col-span-4 bg-slate-800 border border-slate-700 text-slate-50 rounded px-2 py-1 text-sm"
                placeholder="CPIUFDSL"
              />
              <button
                onClick={() => removeItem(index)}
                className="col-span-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm"
                disabled={items.length === 1}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={!canSave || saving}
        className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-700 disabled:text-slate-500 text-white font-semibold py-2 rounded"
      >
        {saving ? 'Saving...' : 'Save Basket'}
      </button>
    </div>
  );
}
