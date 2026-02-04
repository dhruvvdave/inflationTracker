export async function fetchFredSeries(seriesId: string): Promise<{ date: Date; value: number }[]> {
  const apiKey = process.env.FRED_API_KEY;
  if (!apiKey) {
    throw new Error('FRED_API_KEY is not set');
  }

  const url = `https://api.stlouisfed.org/fred/series/observations?series_id=${seriesId}&api_key=${apiKey}&file_type=json&sort_order=asc`;
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch FRED series ${seriesId}: ${response.statusText}`);
  }

  const data = await response.json();
  
  return data.observations
    .filter((obs: any) => obs.value !== '.')
    .map((obs: any) => ({
      date: new Date(obs.date),
      value: parseFloat(obs.value),
    }));
}
