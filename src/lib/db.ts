import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'srv1786.hstgr.io',
  user: 'u753967224_admin',
  password: '5D/8Ezle',
  database: 'u753967224_db_todo_list',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;
