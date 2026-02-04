#!/usr/bin/env ts-node

import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function checkDatabaseSetup() {
  console.log('🔍 Checking database setup...\n');

  // Check if .env file exists
  const envPath = path.join(process.cwd(), '.env');
  if (!fs.existsSync(envPath)) {
    console.error('❌ .env file not found!');
    console.log('\n📝 Solution:');
    console.log('   1. Copy .env.example to .env: cp .env.example .env');
    console.log('   2. Edit .env and add your DATABASE_URL');
    console.log('\n💡 Quick setup options:');
    console.log('   • Docker: docker-compose up -d');
    console.log('   • Supabase: Get connection string from supabase.com');
    console.log('   • Local PostgreSQL: createdb inflationlens\n');
    process.exit(1);
  }

  // Check if DATABASE_URL is set
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL is not set in .env file!');
    console.log('\n📝 Solution:');
    console.log('   Add DATABASE_URL to your .env file. Examples:\n');
    console.log('   Docker:');
    console.log('   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/inflationlens"\n');
    console.log('   Local PostgreSQL:');
    console.log('   DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/inflationlens"\n');
    console.log('   Supabase:');
    console.log('   DATABASE_URL="postgresql://postgres:[PASSWORD]@[HOST]:[PORT]/postgres?sslmode=require"\n');
    process.exit(1);
  }

  console.log('✅ .env file found');
  console.log('✅ DATABASE_URL is set\n');

  // Test database connection
  console.log('🔌 Testing database connection...');
  try {
    await prisma.$connect();
    console.log('✅ Database connection successful!\n');

    // Check if migrations are applied
    console.log('🔍 Checking database schema...');
    try {
      await prisma.basket.findFirst();
      console.log('✅ Database schema is set up correctly!\n');
      
      console.log('🎉 All checks passed! Your database is ready to use.\n');
      console.log('Next steps:');
      console.log('   1. Get a FRED API key: https://fred.stlouisfed.org/docs/api/api_key.html');
      console.log('   2. Add FRED_API_KEY to your .env file');
      console.log('   3. Run: npm run refresh:cpi');
      console.log('   4. Start the app: npm run dev\n');
    } catch (schemaError) {
      console.error('⚠️  Database connected but schema not found');
      console.log('\n📝 Solution:');
      console.log('   Run database migrations:');
      console.log('   1. npx prisma generate');
      console.log('   2. npx prisma migrate dev\n');
    }
  } catch (error: any) {
    console.error('❌ Database connection failed!\n');
    console.error('Error details:', error.message);
    console.log('\n🔧 Common solutions:\n');
    
    if (error.message.includes('ECONNREFUSED')) {
      console.log('   Connection refused - Database is not running:');
      console.log('   • Docker: docker-compose up -d');
      console.log('   • Local PostgreSQL: brew services start postgresql@15');
      console.log('   • Check if port 5432 is correct in DATABASE_URL\n');
    } else if (error.message.includes('authentication failed') || error.message.includes('denied')) {
      console.log('   Authentication/Permission error:');
      console.log('   • Check username and password in DATABASE_URL');
      console.log('   • For local PostgreSQL, grant permissions:');
      console.log('     psql inflationlens -c "GRANT ALL PRIVILEGES ON DATABASE inflationlens TO postgres;"');
      console.log('     psql inflationlens -c "GRANT ALL ON SCHEMA public TO postgres;"\n');
    } else if (error.message.includes('does not exist')) {
      console.log('   Database does not exist:');
      console.log('   • Local PostgreSQL: createdb inflationlens');
      console.log('   • Docker: docker-compose up -d (creates database automatically)');
      console.log('   • Supabase: Database is created automatically with your project\n');
    } else {
      console.log('   For more help, see TROUBLESHOOTING.md\n');
    }
    
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the check
checkDatabaseSetup().catch((error) => {
  console.error('Unexpected error:', error);
  process.exit(1);
});
