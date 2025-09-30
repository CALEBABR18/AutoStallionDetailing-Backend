const { createPayment, getPaymentsByUser } = require('../models/paymentModel');

const create = async (req, res) => {
    const userId = req.user.id;
    const { bookingId, amount, method } = req.body;
    if (!bookingId || !amount || !method) {
        return res.status(400).json({ message: 'All fields required' });
    }
    try {
        const paymentId = await createPayment({ userId, bookingId, amount, method });
        res.status(201).json({ message: 'Payment recorded', paymentId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getUserPayments = async (req, res) => {
    const userId = req.user.id;
    try {
        const payments = await getPaymentsByUser(userId);
        res.json(payments);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { create, getUserPayments };
