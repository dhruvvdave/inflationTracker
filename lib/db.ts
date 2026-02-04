import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Check if DATABASE_URL is set
if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL is not set in environment variables!');
  console.error('\n📝 Quick Setup:');
  console.error('   1. Copy .env.example to .env');
  console.error('   2. Add your DATABASE_URL to .env');
  console.error('   3. Run: npm run setup:db\n');
  console.error('💡 See README.md for detailed setup instructions');
  throw new Error('DATABASE_URL is required');
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['query'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Verify connection on startup in development
if (process.env.NODE_ENV !== 'production') {
  prisma.$connect()
    .then(() => {
      console.log('✅ Database connected successfully');
    })
    .catch((error: any) => {
      console.error('❌ Database connection failed:', error.message);
      console.error('\n🔧 Troubleshooting:');
      console.error('   • Run: npm run setup:db');
      console.error('   • Check TROUBLESHOOTING.md for common issues\n');
    });
}
