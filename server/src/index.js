require('dotenv').config();
const express = require('express');
const cors = require('cors');
const dbConnection = require('./config/db');

const authRoutes = require('./routes/auth');
const structureRoutes = require('./routes/structure');
const attendanceRoutes = require('./routes/attendance');

const app = express();

dbConnection();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/structure', structureRoutes);
app.use('/api/attendance', attendanceRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
