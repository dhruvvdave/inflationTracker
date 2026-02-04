export interface WeightedPoint {
  date: Date;
  value: number;
}

export interface AlignedSeries {
  dates: Date[];
  values: number[];
}

export function pctChange(curr: number, prev: number): number | null {
  if (prev === 0) return null;
  return (curr - prev) / prev;
}

export function mom(series: AlignedSeries, idx: number): number | null {
  if (idx < 1) return null;
  return pctChange(series.values[idx], series.values[idx - 1]);
}

export function yoy(series: AlignedSeries, idx: number): number | null {
  if (idx < 12) return null;
  return pctChange(series.values[idx], series.values[idx - 12]);
}

export function alignSeries(seriesMap: Map<string, WeightedPoint[]>): Map<string, AlignedSeries> {
  // Collect all unique dates
  const allDates = new Set<string>();
  for (const series of seriesMap.values()) {
    for (const point of series) {
      allDates.add(point.date.toISOString().split('T')[0]);
    }
  }

  const sortedDates = Array.from(allDates)
    .sort()
    .map((d) => new Date(d));

  const aligned = new Map<string, AlignedSeries>();

  for (const [seriesId, points] of seriesMap.entries()) {
    const pointMap = new Map<string, number>();
    for (const point of points) {
      pointMap.set(point.date.toISOString().split('T')[0], point.value);
    }

    const values: number[] = [];
    let lastValue: number | null = null;

    for (const date of sortedDates) {
      const dateStr = date.toISOString().split('T')[0];
      if (pointMap.has(dateStr)) {
        lastValue = pointMap.get(dateStr)!;
        values.push(lastValue);
      } else {
        // Forward fill with last known value
        // If no previous value exists, this is handled by having initial data
        values.push(lastValue ?? 0);
      }
    }

    aligned.set(seriesId, { dates: sortedDates, values });
  }

  return aligned;
}

export function computeWeightedIndex(
  aligned: Map<string, AlignedSeries>,
  items: { seriesId: string; weight: number }[]
): AlignedSeries {
  const firstSeries = aligned.values().next().value;
  if (!firstSeries) {
    return { dates: [], values: [] };
  }

  const dates = firstSeries.dates;
  const values: number[] = [];

  for (let i = 0; i < dates.length; i++) {
    let weightedSum = 0;
    for (const item of items) {
      const series = aligned.get(item.seriesId);
      if (series) {
        weightedSum += series.values[i] * item.weight;
      }
    }
    values.push(weightedSum);
  }

  return { dates, values };
}

export function computeCategoryContributions(
  aligned: Map<string, AlignedSeries>,
  items: { seriesId: string; weight: number; category: string }[],
  monthsBack: number
): { category: string; contribution: number }[] {
  const firstSeries = aligned.values().next().value;
  if (!firstSeries || firstSeries.dates.length < monthsBack + 1) {
    return [];
  }

  const currentIdx = firstSeries.dates.length - 1;
  const pastIdx = currentIdx - monthsBack;

  const contributions: { category: string; contribution: number }[] = [];

  for (const item of items) {
    const series = aligned.get(item.seriesId);
    if (series) {
      const change = pctChange(series.values[currentIdx], series.values[pastIdx]);
      if (change !== null) {
        contributions.push({
          category: item.category,
          contribution: change * item.weight,
        });
      }
    }
  }

  return contributions.sort((a, b) => Math.abs(b.contribution) - Math.abs(a.contribution));
}
