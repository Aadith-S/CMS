const express = require('express');
const cc = require("../controller/customerController");
const router = express.Router();
const routera = require("./admin")
const routerp = require("./profile")
router.get("/",(req,res)=>res.redirect("/index"));
router.get("/index",cc.index)
router.get("/login",cc.login);
router.post("/login",cc.login);
router.get("/signup",cc.signup);
router.get("/logout",cc.logout);
router.post("/signup",cc.signup);
router.get("/searchCabs",cc.bookride);
router.get("/driverdetails",cc.driverDetails);
router.use("/profile",routerp);
router.use("/admin",routera);
module.exports = router;