const mongoose = require('mongoose');
const app = require('../backend/app');

const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) return;
    return mongoose.connect(process.env.MONGODB_URI, {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 8000
    });
};

module.exports = async (req, res) => {
    try {
        await connectDB();
    } catch (err) {
        return res.status(500).json({ error: 'DB connection failed', detail: err.message });
    }
    return app(req, res);
};
