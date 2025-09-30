const { getAllPackages } = require('../models/packageModel');

const getPackages = async (req, res) => {
    try {
        const packages = await getAllPackages();
        res.json(packages);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { getPackages };
