const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const authenticate = require('../middleware/auth');

// Create Stripe Checkout session
router.post('/create-checkout-session', authenticate, async (req, res) => {
  const { priceId, quantity = 1, successUrl, cancelUrl } = req.body;
  if (!priceId || !successUrl || !cancelUrl) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity,
        },
      ],
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email: req.user?.email,
    });
    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
