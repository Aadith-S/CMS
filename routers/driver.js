const express = require('express');
const router = express.Router();
const dc = require("../controller/drivercontroller")

router.get("/profile",dc.profile);
router.get("/allBookings",dc.driverBookings)
router.get("/driverUpdate")
router.get("/driverDelete")
router.post("/driverUpdate")
router.post("/driverDelete")

module.exports = router;