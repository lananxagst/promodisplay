const express = require('express');
const cors = require('cors');
const imageRoutes = require('./routes/images');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/images', imageRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'PromoDisplay API is running' });
});

module.exports = app;
