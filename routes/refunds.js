const express = require('express');
const router = express.Router();
const { create, getUserRefunds } = require('../controllers/refundController');
const authenticate = require('../middleware/auth');

router.post('/', authenticate, create);
router.get('/my', authenticate, getUserRefunds);

module.exports = router;
