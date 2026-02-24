import mysql from 'mysql2/promise';

const pool = mysql.createPool({
    host: 'srv1786.hstgr.io',
    user: 'u753967224_admin',
    password: '5D/8Ezle',
    database: 'u753967224_db_todo_list',
});

async function setup() {
    try {
        console.log('⏳ Menghubungkan ke database remote...');
        const connection = await pool.getConnection();
        console.log('✅ Terhubung!');

        console.log('⏳ Membuat tabel todos...');
        await connection.query(`
      CREATE TABLE IF NOT EXISTS todos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        task TEXT NOT NULL,
        is_completed BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
        console.log('✅ Tabel todos berhasil dibuat/diverifikasi.');

        connection.release();
        await pool.end();
        process.exit(0);
    } catch (error) {
        console.error('❌ Gagal setup database:', error);
        process.exit(1);
    }
}

setup();
