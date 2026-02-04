import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    // Test database connection
    await prisma.$connect();
    
    // Try a simple query to verify the database is accessible
    await prisma.$queryRaw`SELECT 1`;
    
    await prisma.$disconnect();
    
    return NextResponse.json({
      status: 'ok',
      database: 'connected',
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Health check failed:', error);
    
    return NextResponse.json(
      {
        status: 'error',
        database: 'disconnected',
        error: error.message || 'Unknown database error',
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    );
  }
}
