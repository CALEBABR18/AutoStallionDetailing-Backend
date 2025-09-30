const { getConnection } = require('./db');

const createPayment = async (payment) => {
    const conn = await getConnection();
    const [result] = await conn.execute(
        'INSERT INTO payments (userId, bookingId, amount, method, status) VALUES (?, ?, ?, ?, ?)',
        [payment.userId, payment.bookingId, payment.amount, payment.method, payment.status || 'pending']
    );
    await conn.end();
    return result.insertId;
};

const getPaymentsByUser = async (userId) => {
    const conn = await getConnection();
    const [rows] = await conn.execute('SELECT * FROM payments WHERE userId = ?', [userId]);
    await conn.end();
    return rows;
};

module.exports = { createPayment, getPaymentsByUser };
