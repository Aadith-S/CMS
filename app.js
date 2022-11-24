const express = require('express');
const parser = require("body-parser");
const app = express();
const Handlebars = require("handlebars")
const path = require('path');
const fs = require("fs");
const route = require("./routers/passenger")
app.use(parser.urlencoded({extended: false}));
app.use("/static",express.static(path.join(__dirname,"static")));
app.use("/",route);
app.listen(80);
