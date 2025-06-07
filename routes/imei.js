const express = require('express');
const router = express.Router();
const { validateIMEI, getDeviceInfo } = require('../utils/imeiValidator');

// In-memory storage for recent checks
let recentChecks = [];

// Home page route
router.get('/', (req, res) => {
  res.render('index.njk', { 
    title: 'IMEI Checker', 
    recentChecks: recentChecks.slice(0, 5) 
  });
});

// API endpoint for IMEI validation
router.post('/api/validate', (req, res) => {
  const { imei } = req.body;
  
  if (!imei) {
    return res.status(400).json({ error: 'IMEI number is required' });
  }

  const isValid = validateIMEI(imei);
  const deviceInfo = isValid ? getDeviceInfo(imei) : null;

  // Add to recent checks
  if (isValid && recentChecks.length >= 5) {
    recentChecks.pop();
  }
  if (isValid) {
    recentChecks.unshift({
      imei,
      timestamp: new Date().toISOString(),
      deviceInfo
    });
  }

  res.json({
    valid: isValid,
    information: deviceInfo
  });
});

module.exports = router;