const mongoose = require('mongoose');
const app = require('../backend/app');

let isConnected = false;

const connectDB = async () => {
    if (isConnected) return;
    await mongoose.connect(process.env.MONGODB_URI);
    isConnected = true;
};

module.exports = async (req, res) => {
    await connectDB();
    return app(req, res);
};
