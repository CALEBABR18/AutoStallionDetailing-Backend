const { createRefund, getRefundsByUser } = require('../models/refundModel');

const create = async (req, res) => {
    const userId = req.user.id;
    const { bookingId, amount, reason } = req.body;
    if (!bookingId || !amount || !reason) {
        return res.status(400).json({ message: 'All fields required' });
    }
    try {
        const refundId = await createRefund({ userId, bookingId, amount, reason });
        res.status(201).json({ message: 'Refund requested', refundId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getUserRefunds = async (req, res) => {
    const userId = req.user.id;
    try {
        const refunds = await getRefundsByUser(userId);
        res.json(refunds);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { create, getUserRefunds };
