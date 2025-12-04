const express = require('express');
const memberRoutes = require('./routes/memberRoutes');
const tournamentRoutes = require('./routes/tournamentRoutes');

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api/members', memberRoutes);
app.use('/api/tournaments', tournamentRoutes);

// Simple health check
app.get('/', (req, res) => {
  res.json({ message: 'Golf Club API is running' });
});

module.exports = app;
