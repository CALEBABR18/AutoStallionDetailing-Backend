
require('dotenv').config();
console.log('ENV:', process.env.DB_HOST, process.env.DB_USER, process.env.DB_PASS, process.env.DB_NAME);
const { getConnection } = require('./models/db.js');

(async () => {
  try {
    const conn = await getConnection();
    const [rows] = await conn.query('SELECT 1 + 1 AS test');
    console.log('MySQL connection test successful:', rows);
    await conn.end();
  } catch (err) {
    console.error('MySQL connection test failed:', err);
  }
})();
