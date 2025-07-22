const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const bodyParser = require('body-parser');

router.use(bodyParser.json());

const ADMIN_CREDENTIALS = {
  username: 'houlers',
  password: 'void2uta',
  id: 'admin001', // Optional fixed admin ID
  name: 'Admin User'
};

// Admin login
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
    const token = jwt.sign(
      { adminId: ADMIN_CREDENTIALS.id, name: ADMIN_CREDENTIALS.name },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    return res.status(200).json({ message: 'Login successful', token });
  }

  return res.status(401).json({ message: 'Invalid credentials' });

  
});

module.exports = router;

