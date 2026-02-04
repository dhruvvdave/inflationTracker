import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Optional: Add seed data here
  console.log('Seed completed');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
