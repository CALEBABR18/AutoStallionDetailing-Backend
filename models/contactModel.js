const { getConnection } = require('./db');

async function createContact({ name, email, subject, message }) {
  const conn = await getConnection();
  const [result] = await conn.execute(
    'INSERT INTO contact_messages (name, email, subject, message) VALUES (?, ?, ?, ?)',
    [name, email, subject, message]
  );
  await conn.end();
  return result.insertId;
}

module.exports = { createContact };
