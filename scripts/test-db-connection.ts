import mariadb from 'mariadb';
import dotenv from 'dotenv';

dotenv.config();

const pool = mariadb.createPool({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  port: Number(process.env.DATABASE_PORT),
  connectionLimit: 5
});

async function testConnection() {
  let conn;
  try {
    console.log(`Connecting to ${process.env.DATABASE_HOST}:${process.env.DATABASE_PORT}...`);
    conn = await pool.getConnection();
    console.log("Connected successfully!");
    const rows = await conn.query("SELECT 1 as val");
    console.log("Query Result:", rows);
  } catch (err) {
    console.error("Connection failed:", err);
  } finally {
    if (conn) conn.end();
    await pool.end();
  }
}

testConnection();
