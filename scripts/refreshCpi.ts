import { PrismaClient } from '@prisma/client';
import { fetchFredSeries } from '../lib/fred';

const prisma = new PrismaClient();

const SERIES_TO_REFRESH = [
  'CPIAUCSL', // All items
  'CPIUFDSL', // Food
  'CPIENGSL', // Energy
  'CPIMEDSL', // Medical care
  'CPITRNSL', // Transportation
  'CPIHOSSL', // Housing
];

async function refreshCpi() {
  console.log('Starting CPI data refresh...');

  for (const seriesId of SERIES_TO_REFRESH) {
    console.log(`Fetching ${seriesId}...`);
    
    try {
      const observations = await fetchFredSeries(seriesId);
      console.log(`  Found ${observations.length} observations`);

      for (const obs of observations) {
        await prisma.cpiSeriesPoint.upsert({
          where: {
            seriesId_date: {
              seriesId,
              date: obs.date,
            },
          },
          update: {
            value: obs.value,
          },
          create: {
            seriesId,
            date: obs.date,
            value: obs.value,
          },
        });
      }

      console.log(`  ✓ ${seriesId} updated`);
    } catch (error) {
      console.error(`  ✗ Error fetching ${seriesId}:`, error);
    }
  }

  console.log('CPI data refresh completed!');
}

refreshCpi()
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
