
const express = require("express");
const router = express.Router();
const Vehicle = require("../models/Vehicle"); // Adjust path as needed
const verifyToken = require("../middleware/auth");
const { isAdmin } = require("../middleware/auth");

router.put("/update-vehicle", verifyToken, isAdmin, async (req, res) => {
  try {
    const { _id, name, type, brand, price, location, description, features } = req.body;

    if (!_id) {
      return res.status(400).json({ message: "Vehicle ID is required" });
    }

    const updated = await Vehicle.findByIdAndUpdate(
      _id,
      {
        name,
        type,
        brand,
        price,
        location,
        description,
        features,
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    res.status(200).json({ message: "Vehicle updated successfully", vehicle: updated });
  } catch (err) {
    console.error("Update vehicle error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.delete("/delete-vehicle/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Vehicle.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Vehicle not found" });
    }
    res.status(200).json({ message: "Vehicle deleted successfully" });
  } catch (err) {
    console.error("Delete vehicle error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
