const express = require('express');
const path = require('path');
const fs = require('fs');
const parser = require("body-parser");
const Handlebars = require("handlebars");
const app = express();
const passenger = require("./db/passenger");
const { getCab } = require('./db/passenger');
const { query } = require('express');
app.use(parser.urlencoded({extended: false}));
app.use("/static",express.static(path.join(__dirname,"static")));
registerPartials("navbar");
registerPartials("footer");
app.get("/",(req,res)=>{
   let content = renderTemplate("index",{});
   res.send(content);
})
app.get("/login",(req,res)=>{
    let content = renderTemplate("login",{});
    res.send(content);
})
app.post("/login",(req,res)=>{
    passenger.authentication(req.body.userName,req.body.passWord).then((n)=>{
        logged = n;
        res.redirect("/")
    }).catch((n)=>{
        logged = n;
        res.redirect("/login")
    })
    
})
app.get("/signup", (req, res)=>{
    let content = renderTemplate("signup",{});
    res.send(content);
})
app.post("/signup", (req, res)=>{
    console.log(req.body);
    passenger.addCustomer(req.body);
    res.redirect("/");
})
app.get("/booking", (req, res)=>{
    let page = req.query;
    console.log(req.query);
    getCab(parseInt(page.page)).then(data=>{
        let info = {
            data : data,
            currentPage : parseInt(page.page),
            prevPage : parseInt(page.page)-1,
            nextPage : parseInt(page.page)+1,
        }
        let content = renderTemplate("booking",info);
        res.send(content);
    })
})
app.listen(80);

function renderTemplate(name,data){
    let filePath = path.join(__dirname,"templates",name+".hbs");
    let templatetext = fs.readFileSync(filePath,"utf-8");
    let template = Handlebars.compile(templatetext);
    return template(data);
}
function registerPartials(data){
    let filePath = path.join(__dirname,"templates","partials",data+".hbs");
    let templatetext = fs.readFileSync(filePath,"utf-8");
    Handlebars.registerPartial(data,templatetext);
}