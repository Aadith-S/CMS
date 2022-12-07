const express = require('express');
const pc = require("../controller/profileController");
const router = express.Router();
const admin = require("../controller/adminController")
router.get("/driverAdd",admin.add);
router.get("/driverDelete",admin.delete);
router.get("/driverUpdate",admin.update);
router.get("/viewAllUsers",admin.viewAllUsers)
router.get("/viewAllDrivers",admin.viewAllDrivers)
router.get("/driverAdd/:driver_id",admin.adddriver);
router.post("/driverDelete",admin.delete);
router.post("/driverUpdate",admin.update);
router.get("/selectCab",admin.selectCab);
router.get("/selectDriver",admin.assignDriver);
router.get("/cabset",admin.cabAssign);
router.get("/cabAdd",admin.cabAdd);
router.post("/cabAdd",admin.cabAdd);
router.get("/cabDel",admin.deletecab);
router.get("/allBookings",admin.allBookingsDate);
router.post("/allBookings",admin.allBookingsDate);
router.get("/clear",admin.clear);
module.exports = router;
