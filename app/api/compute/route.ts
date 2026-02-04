import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import {
  alignSeries,
  computeWeightedIndex,
  computeCategoryContributions,
  mom,
  yoy,
  WeightedPoint,
} from '@/lib/inflation';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const basketId = searchParams.get('basketId');

    if (!basketId) {
      return NextResponse.json({ error: 'basketId is required' }, { status: 400 });
    }

    const basket = await prisma.basket.findUnique({
      where: { id: basketId },
      include: { items: true },
    });

    if (!basket) {
      return NextResponse.json({ error: 'Basket not found' }, { status: 404 });
    }

    // Fetch CPI data for basket items
    const seriesIds = basket.items.map((item) => item.seriesId);
    seriesIds.push('CPIAUCSL'); // Add national CPI

    const seriesMap = new Map<string, WeightedPoint[]>();

    for (const seriesId of seriesIds) {
      const points = await prisma.cpiSeriesPoint.findMany({
        where: { seriesId },
        orderBy: { date: 'asc' },
      });

      seriesMap.set(
        seriesId,
        points.map((p) => ({ date: p.date, value: p.value }))
      );
    }

    // Align all series
    const aligned = alignSeries(seriesMap);

    // Compute weighted personal index
    const personalIndex = computeWeightedIndex(
      aligned,
      basket.items.map((item) => ({
        seriesId: item.seriesId,
        weight: item.weight,
      }))
    );

    const nationalSeries = aligned.get('CPIAUCSL');
    
    if (!nationalSeries || !personalIndex.dates.length) {
      return NextResponse.json({ error: 'Insufficient data' }, { status: 400 });
    }

    // Build timeline
    const timeline = personalIndex.dates.map((date, idx) => ({
      date: date.toISOString().split('T')[0],
      personal: personalIndex.values[idx],
      national: nationalSeries.values[idx],
    }));

    // Calculate KPIs
    const lastIdx = personalIndex.dates.length - 1;
    const personalYoY = yoy(personalIndex, lastIdx);
    const personalMoM = mom(personalIndex, lastIdx);
    const nationalYoY = yoy(nationalSeries, lastIdx);
    const nationalMoM = mom(nationalSeries, lastIdx);

    // Calculate category contributions
    const drivers = computeCategoryContributions(
      aligned,
      basket.items.map((item) => ({
        seriesId: item.seriesId,
        weight: item.weight,
        category: item.category,
      })),
      12
    ).slice(0, 5);

    return NextResponse.json({
      basket: {
        id: basket.id,
        name: basket.name,
        items: basket.items,
      },
      timeline,
      kpis: {
        personalYoY,
        personalMoM,
        nationalYoY,
        nationalMoM,
      },
      drivers,
    });
  } catch (error) {
    console.error('Error computing inflation:', error);
    return NextResponse.json({ error: 'Failed to compute inflation' }, { status: 500 });
  }
}
