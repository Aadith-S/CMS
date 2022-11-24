const express = require('express');
const pc = require("../controller/profileController");
const router = express.Router();
router.get("",(req,res)=>{
    res.send("hlo");
})
router.post("/update",pc.update);
router.post("/delete",pc.delete);
module.exports = router;