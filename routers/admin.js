const express = require('express');
const pc = require("../controller/profileController");
const router = express.Router();
const admin = require("../controller/adminController")
router.get("/driverAdd",admin.add);
router.get("/driverDelete",admin.delete);
router.get("/driverUpdate",admin.update);
router.get("/viewAllUsers",admin.viewAllUsers)
router.get("/viewAllDrivers",admin.viewAllDrivers)
router.post("/driverAdd",admin.add);
router.post("/driverDelete",admin.delete);
router.post("/driverUpdate",admin.update);
router.get("/selectCab",admin.assignDriver);
router.get("/cabset",admin.cabAssign);
router.get("/cabAdd",admin.cabAdd);
router.post("/cabAdd",admin.cabAdd);
module.exports = router;
