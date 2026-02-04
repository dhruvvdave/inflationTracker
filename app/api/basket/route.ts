import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { validateBasket, BasketInput } from '@/lib/validation';

export async function GET() {
  try {
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
    const body = await request.json();
    
    validateBasket(body);
    const input = body as BasketInput;

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
