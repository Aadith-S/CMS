const express = require('express');
const pc = require("../controller/profileController");
const router = express.Router();
router.get("",pc.profile)
router.get("/update",pc.update);
router.get("/delete",pc.delete);
router.post("/update",pc.update);
router.post("/delete",pc.delete);
router.get("/bookCab",pc.bookpage);
router.post("/bookCab",pc.bookpage);
router.get("/invoice",pc.invoice);
router.get("/invoicepdf",pc.invoicepdf);
router.get('/payment',pc.payment);
router.post('/payment',pc.payment);
router.get('/allbookings',pc.userBookings);
module.exports = router;