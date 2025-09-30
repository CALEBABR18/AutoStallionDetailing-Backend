const { createBooking, getBookingsByUser, getAllBookings: getAllBookingsModel } = require('../models/bookingModel');


// create uses packageName
const create = async (req, res) => {
    console.log('--- Incoming Booking Request ---');
    console.log('Body:', req.body);
    const { userId, packageId, carSize, bookingDate, bookingTime, vehicleType, vehicleModel, customerNotes, customerAddress, totalPrice } = req.body;
    if (!userId || !packageId || !carSize || !bookingDate || !bookingTime || !vehicleType || !vehicleModel || !customerAddress || !totalPrice) {
        console.error('Booking error: Missing fields', req.body);
        return res.status(400).json({ message: 'All fields required' });
    }
    try {
        const bookingId = await createBooking({ userId, packageId, carSize, bookingDate, bookingTime, vehicleType, vehicleModel, customerNotes, customerAddress, totalPrice });
        console.log('Booking created successfully:', bookingId);
        res.status(201).json({ message: 'Booking created', bookingId });
    } catch (err) {
        console.error('Booking creation failed:', err);
        if (err && err.stack) {
            console.error('Stack trace:', err.stack);
        }
        res.status(500).json({ error: err.message, stack: err.stack });
    }
};

const getUserBookings = async (req, res) => {
    const userId = req.user.id;
    try {
        const bookings = await getBookingsByUser(userId);
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { create, getUserBookings };

// TEMP: Get all bookings for debugging
const getAllBookings = async (req, res) => {
    try {
        const bookings = await getAllBookingsModel();
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports.getAllBookings = getAllBookings;
