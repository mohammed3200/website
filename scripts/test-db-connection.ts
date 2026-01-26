// scripts/test-db-connection.ts
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

// Construct DATABASE_URL if not provided
if (!process.env.DATABASE_URL) {
  if (process.env.DATABASE_HOST) {
    const host = process.env.DATABASE_HOST;
    const user = process.env.DATABASE_USER || 'root';
    const password = process.env.DATABASE_PASSWORD || '';
    const database = process.env.DATABASE_NAME || 'citcoder_eitdc';
    const port = process.env.DATABASE_PORT || '3306';
    process.env.DATABASE_URL = `mysql://${user}:${password}@${host}:${port}/${database}`;
  } else {
    throw new Error('DATABASE_URL or DATABASE_HOST must be set');
  }
}

const prisma = new PrismaClient();

async function testConnection() {
  try {
    console.log('🔍 Testing database connection...');
    console.log(`📡 Database URL: ${process.env.DATABASE_URL?.replace(/:[^:@]+@/, ':****@')}`);
    
    // Test 1: Simple query
    console.log('\n1️⃣ Testing basic connection...');
    await prisma.$queryRaw`SELECT 1`;
    console.log('✅ Basic connection successful!');
    
    // Test 2: Check database version
    console.log('\n2️⃣ Checking database version...');
    const version = await prisma.$queryRaw<Array<{ version: string }>>`SELECT VERSION() as version`;
    console.log(`✅ Database version: ${version[0]?.version}`);
    
    // Test 3: List tables
    console.log('\n3️⃣ Listing tables...');
    const tables = await prisma.$queryRaw<Array<{ Tables_in_citcoder_eitdc: string }>>`
      SHOW TABLES
    `;
    console.log(`✅ Found ${tables.length} tables:`);
    tables.forEach((table, index) => {
      console.log(`   ${index + 1}. ${table.Tables_in_citcoder_eitdc}`);
    });
    
    // Test 4: Check Prisma models (if tables exist)
    if (tables.length > 0) {
      console.log('\n4️⃣ Testing Prisma models...');
      try {
        const userCount = await prisma.user.count();
        console.log(`✅ User model accessible - Found ${userCount} users`);
      } catch (error) {
        console.log('⚠️  User model test failed (table might not exist yet)');
      }
    }
    
    console.log('\n✅ All connection tests passed!');
    
  } catch (error) {
    console.error('\n❌ Connection test failed:');
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
