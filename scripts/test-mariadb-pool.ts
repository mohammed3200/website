import mariadb from 'mariadb';
import 'dotenv/config';

async function testPool() {
  console.log('--- Testing MariaDB Pool Connection ---');
  console.log(`Host: ${process.env.DATABASE_HOST}`);
  console.log(`User: ${process.env.DATABASE_USER}`);
  console.log(`Port: ${process.env.DATABASE_PORT}`);
  console.log(`Database: ${process.env.DATABASE_NAME}`);
  
  const pool = mariadb.createPool({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    port: Number(process.env.DATABASE_PORT),
    connectionLimit: 5
  });

  try {
    console.log('Attempting to getConnection()...');
    const conn = await pool.getConnection();
    console.log('✅ Connection successful!');
    
    const rows = await conn.query('SELECT 1 as val');
    console.log('Query result:', rows);
    
    conn.release();
    console.log('Connection released.');
  } catch (err) {
    console.error('❌ Connection failed:', err);
  } finally {
    await pool.end();
  }
}

testPool();
