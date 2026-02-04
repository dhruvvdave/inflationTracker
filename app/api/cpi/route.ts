import { NextResponse } from 'next/server';
import { isDatabaseConfigured, prisma } from '@/lib/db';

export async function GET(request: Request) {
  try {
    if (!isDatabaseConfigured || !prisma) {
      return NextResponse.json(
        { error: 'DATABASE_URL is not configured. Please set up the database.' },
        { status: 503 }
      );
    }

    const { searchParams } = new URL(request.url);
    const seriesId = searchParams.get('seriesId');

    if (!seriesId) {
      return NextResponse.json({ error: 'seriesId is required' }, { status: 400 });
    }

    const points = await prisma.cpiSeriesPoint.findMany({
      where: {
        seriesId,
      },
      orderBy: {
        date: 'asc',
      },
    });

    const result = points.map((point) => ({
      date: point.date.toISOString(),
      value: point.value,
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching CPI data:', error);
    return NextResponse.json({ error: 'Failed to fetch CPI data' }, { status: 500 });
  }
}
