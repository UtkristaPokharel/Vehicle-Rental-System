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

// // Check token before file upload
// router.post('/add-vehicle', async (req, res, next) => {
//   const token = req.headers.authorization;
//   if (token !== 'Bearer secure-admin-token') {
//     return res.status(403).json({ message: 'Not authorized' });
//   }

//   // Attach token to request and go to next middleware
//   next();
// }, upload.single("image"), async (req, res) => {
//   try {
//     const { name, type, brand, price, location } = req.body;

//     if (!name || !type || !brand || !price || !location) {
//       return res.status(400).json({ message: "Missing fields" });
//     }
//     if (!isNaN(name[0]) || !isNaN(brand[0]) || !isNaN(type[0])) {
//       return res.status(400).json({ message: "Name, brand, or type can't start with number" });
//     }
//     if (Number(price) <= 0) {
//       return res.status(400).json({ message: "Price must be positive" });
//     }

//     const imageUrl = req.file ? `/uploads/vehicles/${req.file.filename}` : "";

//     const newVehicle = new Vehicle({ name, type, brand, imageUrl, price, location });
//     await newVehicle.save();

//     res.status(201).json({ message: "Vehicle added", vehicle: newVehicle });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// module.exports = router;
