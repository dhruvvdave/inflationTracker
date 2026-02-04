export interface BasketItemInput {
  category: string;
  weight: number;
  seriesId: string;
}

export interface BasketInput {
  name: string;
  items: BasketItemInput[];
}

export function validateBasket(input: any): input is BasketInput {
  if (typeof input.name !== 'string' || input.name.trim() === '') {
    throw new Error('Basket name must be a non-empty string');
  }

  if (!Array.isArray(input.items) || input.items.length === 0) {
    throw new Error('Basket must have at least one item');
  }

  let totalWeight = 0;
  for (const item of input.items) {
    if (typeof item.category !== 'string' || item.category.trim() === '') {
      throw new Error('Each item must have a category');
    }
    if (typeof item.weight !== 'number' || item.weight <= 0) {
      throw new Error('Each item must have a positive weight');
    }
    if (typeof item.seriesId !== 'string' || item.seriesId.trim() === '') {
      throw new Error('Each item must have a seriesId');
    }
    totalWeight += item.weight;
  }

  if (Math.abs(totalWeight - 1.0) > 0.0001) {
    throw new Error(`Weights must sum to 1.0 (got ${totalWeight})`);
  }

  return true;
}
