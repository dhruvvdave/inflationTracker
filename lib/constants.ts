// Shared constants for the application

export const WEIGHT_TOLERANCE = 0.0001;

export const CPI_SERIES_OPTIONS = [
  { label: 'All Items (National CPI)', value: 'CPIAUCSL' },
  { label: 'Food', value: 'CPIUFDSL' },
  { label: 'Energy', value: 'CPIENGSL' },
  { label: 'Medical Care', value: 'CPIMEDSL' },
  { label: 'Transportation', value: 'CPITRNSL' },
  { label: 'Housing', value: 'CPIHOSSL' },
] as const;
