import mysql from 'mysql2/promise';

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST || 'srv1786.hstgr.io',
    user: process.env.MYSQL_USER || 'u753967224_admin',
    password: process.env.MYSQL_PASSWORD || '5D/8Ezle',
    database: process.env.MYSQL_DATABASE || 'u753967224_db_todo_list',
    waitForConnections: true,
    connectionLimit: 5,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 10000,
});

export default pool;
