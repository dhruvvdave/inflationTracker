import {
  pctChange,
  mom,
  yoy,
  computeWeightedIndex,
  AlignedSeries,
} from '../lib/inflation';

describe('Inflation calculations', () => {
  describe('pctChange', () => {
    it('should calculate percentage change correctly', () => {
      expect(pctChange(110, 100)).toBe(0.1);
      expect(pctChange(105, 100)).toBe(0.05);
      expect(pctChange(95, 100)).toBe(-0.05);
    });

    it('should return null when previous value is 0', () => {
      expect(pctChange(100, 0)).toBe(null);
    });
  });

  describe('mom', () => {
    it('should calculate month-over-month change', () => {
      const series: AlignedSeries = {
        dates: [new Date('2023-01-01'), new Date('2023-02-01'), new Date('2023-03-01')],
        values: [100, 105, 110],
      };

      expect(mom(series, 0)).toBe(null); // First month has no previous
      expect(mom(series, 1)).toBeCloseTo(0.05, 5);
      expect(mom(series, 2)).toBeCloseTo(0.047619, 5);
    });
  });

  describe('yoy', () => {
    it('should return null for indices less than 12', () => {
      const series: AlignedSeries = {
        dates: Array.from({ length: 11 }, (_, i) => new Date(2023, i, 1)),
        values: Array.from({ length: 11 }, (_, i) => 100 + i),
      };

      expect(yoy(series, 10)).toBe(null);
    });

    it('should calculate year-over-year change correctly', () => {
      const series: AlignedSeries = {
        dates: Array.from({ length: 24 }, (_, i) => new Date(2023, i, 1)),
        values: Array.from({ length: 24 }, (_, i) => (i < 12 ? 100 : 110)),
      };

      expect(yoy(series, 12)).toBeCloseTo(0.1, 5);
    });
  });

  describe('computeWeightedIndex', () => {
    it('should compute weighted average correctly', () => {
      const aligned = new Map<string, AlignedSeries>();
      aligned.set('SERIES1', {
        dates: [new Date('2023-01-01'), new Date('2023-02-01')],
        values: [100, 110],
      });
      aligned.set('SERIES2', {
        dates: [new Date('2023-01-01'), new Date('2023-02-01')],
        values: [200, 220],
      });

      const items = [
        { seriesId: 'SERIES1', weight: 0.4 },
        { seriesId: 'SERIES2', weight: 0.6 },
      ];

      const result = computeWeightedIndex(aligned, items);

      expect(result.dates.length).toBe(2);
      expect(result.values[0]).toBeCloseTo(160, 5); // 100*0.4 + 200*0.6 = 160
      expect(result.values[1]).toBeCloseTo(176, 5); // 110*0.4 + 220*0.6 = 176
    });
  });
});
