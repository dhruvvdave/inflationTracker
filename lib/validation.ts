import { WEIGHT_TOLERANCE } from './constants';

export interface BasketItemInput {
  category: string;
  weight: number;
  seriesId: string;
}

export interface BasketInput {
  name: string;
  items: BasketItemInput[];
}

const normalizeText = (value: unknown, field: string): string => {
  if (typeof value !== 'string') {
    throw new Error(`${field} must be a string`);
  }

  const trimmed = value.trim();
  if (!trimmed) {
    throw new Error(`${field} must be a non-empty string`);
  }

  return trimmed;
};

const normalizeWeight = (value: unknown): number => {
  const weight = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(weight) || weight <= 0) {
    throw new Error('Each item must have a positive weight');
  }

  return weight;
};

export function validateBasket(input: unknown): BasketInput {
  if (!input || typeof input !== 'object') {
    throw new Error('Basket payload must be an object');
  }

  const basketInput = input as BasketInput;
  const name = normalizeText(basketInput.name, 'Basket name');

  if (!Array.isArray(basketInput.items) || basketInput.items.length === 0) {
    throw new Error('Basket must have at least one item');
  }

  let totalWeight = 0;
  const items = basketInput.items.map((item) => {
    if (!item || typeof item !== 'object') {
      throw new Error('Each item must be an object');
    }

    const category = normalizeText(item.category, 'Each item category');
    const weight = normalizeWeight(item.weight);
    const seriesId = normalizeText(item.seriesId, 'Each item seriesId').toUpperCase();

    totalWeight += weight;

    return {
      category,
      weight,
      seriesId,
    };
  });

  if (Math.abs(totalWeight - 1.0) > WEIGHT_TOLERANCE) {
    throw new Error(`Weights must sum to 1.0 (got ${totalWeight})`);
  }

  return {
    name,
    items,
  };
}
