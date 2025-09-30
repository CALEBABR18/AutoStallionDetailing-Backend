const { getConnection } = require('./db');

const createRefund = async (refund) => {
    const conn = await getConnection();
    const [result] = await conn.execute(
        'INSERT INTO refunds (userId, bookingId, amount, reason, status) VALUES (?, ?, ?, ?, ?)',
        [refund.userId, refund.bookingId, refund.amount, refund.reason, refund.status || 'pending']
    );
    await conn.end();
    return result.insertId;
};

const getRefundsByUser = async (userId) => {
    const conn = await getConnection();
    const [rows] = await conn.execute('SELECT * FROM refunds WHERE userId = ?', [userId]);
    await conn.end();
    return rows;
};

module.exports = { createRefund, getRefundsByUser };
