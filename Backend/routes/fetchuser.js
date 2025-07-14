const express = require('express');
const router = express.Router();
const User = require('../models/User'); // adjust path
const verifyToken = require('../middleware/auth');

// GET all vehicles
router.get('/', async (req, res) => {
  try { 
    const users = await User.find(); 
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/delete-user/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await User.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Delete user error:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
