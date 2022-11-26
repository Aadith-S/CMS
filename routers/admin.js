const express = require('express');
const pc = require("../controller/profileController");
const router = express.Router();
const admin = require("../controller/adminController")
router.get("/driverAdd");
router.get("/driverDelete",admin.delete);
router.get("/driverUpdate",admin.update);
router.get("/viewAllUsers",admin.viewAllUsers)
router.post("/driverAdd");
router.post("/driverDelete",admin.delete);
router.post("/driverUpdate",admin.update);
module.exports = router;
