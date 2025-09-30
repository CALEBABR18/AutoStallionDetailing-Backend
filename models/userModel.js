const { getConnection } = require('./db');

const findUserByEmail = async (email) => {
    const conn = await getConnection();
    const [rows] = await conn.execute('SELECT * FROM users WHERE email = ?', [email]);
    await conn.end();
    return rows[0];
};

const createUser = async (user) => {
    const conn = await getConnection();
    const [result] = await conn.execute(
        'INSERT INTO users (firstName, lastName, email, password, phone, address) VALUES (?, ?, ?, ?, ?, ?)',
        [user.firstName, user.lastName, user.email, user.password, user.phone, user.address]
    );
    await conn.end();
    return result.insertId;
};

const updateUserPassword = async (email, hashedPassword) => {
    const conn = await getConnection();
    await conn.execute('UPDATE users SET password = ? WHERE email = ?', [hashedPassword, email]);
    await conn.end();
};

module.exports = { findUserByEmail, createUser, updateUserPassword };
