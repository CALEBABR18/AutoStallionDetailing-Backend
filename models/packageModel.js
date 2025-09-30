const { getConnection } = require('./db');

const getAllPackages = async () => {
    const conn = await getConnection();
    const [rows] = await conn.execute('SELECT * FROM packages WHERE isActive = TRUE');
    await conn.end();
    return rows;
};

module.exports = { getAllPackages };
