const express = require('express');
const parser = require("body-parser");
const app = express();
const cookieSession = require("cookie-session");
const path = require('path');
const authSession = require("./auth")
const route = require("./routers/passenger")
app.use(parser.urlencoded({extended: false}));
app.use("/static",express.static(path.join(__dirname,"static")));
app.use(cookieSession({
    name : "session",
    keys : ["aadith"],
    httpOnly : true,
    maxAge : 60 * 60 * 24 * 1000,
}))
app.use(authSession);
app.use("/",route);
app.listen(80);
