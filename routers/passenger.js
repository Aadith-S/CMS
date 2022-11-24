const express = require('express');
const cc = require("../controller/customerController");
const router = express.Router();
const routerp = require("./profile")
router.get("",cc.index)
router.get("/login",cc.login);
router.post("/login",cc.login);
router.get("/signup",cc.signup);
router.post("/signup",cc.signup);
router.get("/booking",cc.bookride);
router.get("/searchCabs",cc.bookride);
router.post("/bookCab",cc.bookpage);
router.get("/driverdetails",cc.driverDetails);
router.post("/driverdetails",cc.driverDetails);
router.use("/profile",routerp);
module.exports = router;