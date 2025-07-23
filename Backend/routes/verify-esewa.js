import express from "express";
import axios from "axios";

const router = express.Router();

router.post("/verify-esewa", async (req, res) => {
  const { amt, refId, oid } = req.body;

  try {
    const params = new URLSearchParams({
      amt,
      pid: oid,
      rid: refId,
      scd: "EPAYTEST", // sandbox merchant code
    });

    const { data } = await axios.get(
      `https://rc-epay.esewa.com.np/api/epay/verify/v1?${params}`
    );

    if (data.status === "COMPLETE") {
      // Save transaction in DB if needed
      return res.json({ verified: true, data });
    } else {
      return res.json({ verified: false, data });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

export default router;
