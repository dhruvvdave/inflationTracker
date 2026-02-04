import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const isDatabaseConfigured = Boolean(process.env.DATABASE_URL);

if (!isDatabaseConfigured) {
  console.error('❌ DATABASE_URL is not set in environment variables!');
  console.error('\n📝 Quick Setup:');
  console.error('   1. Copy .env.example to .env');
  console.error('   2. Add your DATABASE_URL to .env');
  console.error('   3. Run: npm run setup:db\n');
  console.error('💡 See README.md for detailed setup instructions');
}

export const prisma =
  isDatabaseConfigured
    ? globalForPrisma.prisma ??
      new PrismaClient({
        log: ['query'],
      })
    : null;

if (prisma && process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Verify connection on startup in development
if (prisma && process.env.NODE_ENV !== 'production') {
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
