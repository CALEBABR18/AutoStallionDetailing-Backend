const express = require('express');
const router = express.Router();
const { create, getUserPayments } = require('../controllers/paymentController');
const authenticate = require('../middleware/auth');

router.post('/', authenticate, create);
router.get('/my', authenticate, getUserPayments);

module.exports = router;
