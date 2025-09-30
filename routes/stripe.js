const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Create a Stripe PaymentIntent
router.post('/create-payment-intent', authenticate, async (req, res) => {
    const { amount, currency } = req.body;
    if (!amount || !currency) {
        return res.status(400).json({ message: 'Amount and currency required' });
    }
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency,
            metadata: { userId: req.user.id }
        });
        res.json({ clientSecret: paymentIntent.client_secret });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
