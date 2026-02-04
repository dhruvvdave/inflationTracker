import { NextResponse } from 'next/server';
import { isDatabaseConfigured, prisma } from '@/lib/db';
import { validateBasket } from '@/lib/validation';

export async function GET() {
  try {
    if (!isDatabaseConfigured || !prisma) {
      return NextResponse.json(
        { error: 'DATABASE_URL is not configured. Please set up the database.' },
        { status: 503 }
      );
    }

    const baskets = await prisma.basket.findMany({
      include: {
        items: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return NextResponse.json(baskets);
  } catch (error) {
    console.error('Error fetching baskets:', error);
    return NextResponse.json({ error: 'Failed to fetch baskets' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    if (!isDatabaseConfigured || !prisma) {
      return NextResponse.json(
        { error: 'DATABASE_URL is not configured. Please set up the database.' },
        { status: 503 }
      );
    }

    const body = await request.json();
    
    const input = validateBasket(body);

    const basket = await prisma.basket.create({
      data: {
        name: input.name,
        items: {
          create: input.items.map((item) => ({
            category: item.category,
            weight: item.weight,
            seriesId: item.seriesId,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    return NextResponse.json(basket, { status: 201 });
  } catch (error: any) {
    console.error('Error creating basket:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create basket' },
      { status: 400 }
    );
  }
}
