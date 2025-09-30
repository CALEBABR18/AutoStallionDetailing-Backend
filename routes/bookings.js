const express = require('express');
const router = express.Router();

// Log all incoming requests to this route
const logRequests = (req, res, next) => {
	console.log(`[BOOKINGS ROUTE] ${req.method} ${req.originalUrl} | Body:`, req.body, '| Cookies:', req.cookies);
	next();
};

const authenticate = require('../middleware/auth');
const { create, getUserBookings } = require('../controllers/bookingController');

// Get all bookings for debugging
const { getAllBookings } = require('../controllers/bookingController');



router.use(logRequests); // Log all requests to /api/bookings
router.post('/', create); // No authentication for testing
router.get('/', getAllBookings); // Public route for all bookings

module.exports = router;
