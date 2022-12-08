const express = require('express');
const router = express.Router();
const dc = require("../controller/drivercontroller")

router.get("/profile",dc.profile);
router.get("/allBookings",dc.driverBookings)
router.get("/driverUpdate",dc.update)
router.get("/driverDelete",dc.delete)
router.post("/driverUpdate",dc.update)
router.post("/driverDelete",dc.delete)

module.exports = router;