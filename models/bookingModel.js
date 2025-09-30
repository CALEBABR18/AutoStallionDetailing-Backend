const { getConnection } = require('./db');


// createBooking uses userId, packageId, carSize, and new schema
const createBooking = async (booking) => {
    const conn = await getConnection();
    const [result] = await conn.execute(
        'INSERT INTO bookings (userId, packageId, carSize, bookingDate, bookingTime, vehicleType, vehicleModel, customerNotes, customerAddress, totalPrice, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [booking.userId, booking.packageId, booking.carSize, booking.bookingDate, booking.bookingTime, booking.vehicleType, booking.vehicleModel, booking.customerNotes, booking.customerAddress, booking.totalPrice, 'pending']
    );
    await conn.end();
    return result.insertId;
};


const getBookingsByUser = async (userId) => {
    const conn = await getConnection();
    const [rows] = await conn.execute('SELECT * FROM bookings WHERE userId = ?', [userId]);
    await conn.end();
    return rows;
};


const getAllBookings = async () => {
    const conn = await getConnection();
    const [rows] = await conn.execute('SELECT * FROM bookings');
    await conn.end();
    return rows;
};

module.exports = { createBooking, getBookingsByUser, getAllBookings };
