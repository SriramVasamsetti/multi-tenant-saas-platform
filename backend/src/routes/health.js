const express = require('express');
const router = express.Router();
const pool = require('../config/database');

router.get('/', async (req, res) => {
  try {
    // Check DB connection
    await pool.query('SELECT 1');
    res.status(200).json({ status: "ok", database: "connected" });
  } catch (err) {
    console.error('Health check failed:', err);
    res.status(503).json({ status: "error", database: "disconnected" });
  }
});

module.exports = router;
