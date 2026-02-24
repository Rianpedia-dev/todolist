import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
});

async function testConnection() {
    try {
        console.log('⏳ Mencoba koneksi ke database dengan config baru...');
        console.log(`Host: ${process.env.MYSQL_HOST}`);
        console.log(`User: ${process.env.MYSQL_USER}`);

        const connection = await pool.getConnection();
        console.log('✅ Koneksi BERHASIL!');

        const [rows] = await connection.query('SELECT 1 + 1 AS result');
        console.log(`✅ Query Test Berhasil (1+1=${rows[0].result})`);

        const [tableInfo] = await connection.query("SHOW TABLES LIKE 'todos'");
        if (tableInfo.length > 0) {
            console.log('✅ Tabel "todos" ditemukan.');
        } else {
            console.log('⚠️ Tabel "todos" tidak ditemukan, dijalankan ulang via setup-db jika perlu.');
        }

        connection.release();
        await pool.end();
    } catch (error) {
        console.error('❌ Koneksi GAGAL:', error.message);
    }
}

testConnection();
