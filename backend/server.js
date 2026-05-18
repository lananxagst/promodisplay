const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const imageRoutes = require('./routes/images');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/images', imageRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'PromoDisplay API is running' });
});

mongoose
    .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/promodisplay')
    .then(() => {
        console.log('✅ MongoDB connected');
        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error('❌ MongoDB connection error:', err.message);
        process.exit(1);
    });
