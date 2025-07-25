const express = require('express');
const router = express.Router();

// Import eSewa payment routes
const esewaRoutes = require('./esewa-payment');

// Use eSewa routes
router.use('/esewa', esewaRoutes);

// Add other payment method routes here in the future
// router.use('/stripe', stripeRoutes);
// router.use('/paypal', paypalRoutes);

module.exports = router;
