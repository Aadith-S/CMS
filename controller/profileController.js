const db = require("../model/passenger");
const renderTemplate = require("../views/view")
const puppeteer = require("puppeteer");
let cost = 0
function viewAllBookings(page,user_id){
    return new Promise((res,rej)=>{
        db.Bookride.findAll({
    include:
    [{
        model : db.Cab,
        required : true,
        include : { model : db.Customer,
                    required : true,
                    where : {driver : 1}
                }
        },
        {
            model : db.Location,
            required : true
        }],
    where : { user_id : user_id }
    }).then((result)=>{
            let data = [];
            let pages = Math.ceil(result.length/5)
            if(page<1){
                page = 1;
            }
            else if(page>pages){
                page = pages;
            }
            console.log(result);
            if(result.length == 0){
                data = 0;
            }
            else{
            for(let i = 5*(page-1);i<5*page && i<result.length;i++){
                data.push(result[i].dataValues)
            }
            }
            let body ={
                data : data,
                pages : pages,
            }
            res(body);
        })
    })
}
function userUpdate(user_id,details){
    return new Promise((res,rej)=>{
    db.Customer.update(details,{where :{user_id :user_id}}).then((result)=>{console.log(result); res("success")}).catch((err)=>{
        rej(err);
    })
    })
}

function deleteUser(user_id){
    return new Promise((res,rej)=>{
        db.Customer.destroy({where: {user_id:user_id }}).then((result)=>{console.log(result); res("success")}).catch((err)=>{
            rej(err);
    })
    })
}
function booking(details,user_id,cab_no){
    return new Promise((res,req)=>{
        db.Location.findOne({where : {pickup : details.pickup,dropoff : details.dropoff}}).then((loc)=>{
            let date = new Date();
            cost = loc.cost;
            console.log(user_id);
            console.log(cab_no);
            let data = {
                date_of_booking : date,
                date_of_ride : details.date_of_ride,
                location_id : loc.location_id,
                ride_time : details.ride_time,
                cost : loc.cost,
                cab_no : parseInt(cab_no),
                user_id : user_id,
                }
                db.Bookride.create(data).then(result => {res(result)}).catch(err => {console.log(err)});
        })
    })
}

module.exports = {
    profile : (req,res)=>{
            let info = {
                info : req.identity.user,
                isAuthenticated : req.identity.isAuthenticated
            }
            let content = renderTemplate('profile',info);
            res.send(content);
    },
    update : (req,res)=>{
        if(req.method == 'POST'){
            userUpdate(req.session.user_id,req.body).then((result)=>{
                res.redirect("/profile");
            }).catch((err)=>{
                console.log(err);
            });
        }
        else{
            let content = renderTemplate("profileUpdate",{isAuthenticated : req.identity.isAuthenticated});
            res.send(content);
        }
    },
    delete: (req,res)=>{
        if(req.method == 'POST'){
        deleteUser(req.session.user_id).then((result)=>{res.redirect("/signup");}).catch((err)=>{console.log(err);});
        }
        else{
            let content = renderTemplate("profileDelete",{isAuthenticated : req.identity.isAuthenticated});
            res.send(content);
        }
    },
    bookpage : (req, res) => {
        if(req.method == "GET"){
            let content = renderTemplate("bookCab",{isAuthenticated : req.identity.isAuthenticated,cab_no : req.query.cab_no});
                res.send(content);
        }
        else{
            booking(req.body,req.session.user_id,req.query.cab_no).then((result) => {res.redirect("/profile/payment?ride_otp="+result.ride_otp+"&cost="+result.cost)})
        }
    },
    invoice : (req, res) => {
        if(req.method == "GET"){
            db.Bookride.findByPk(req.query.ride_otp,{
                include : {
                    model : db.Location,
                    required : true
                }
            }).then((result) => { console.log(result);
            let content = renderTemplate("invoice",{isAuthenticated : req.identity.isAuthenticated,data : result.dataValues });
            res.send(content);})
            
        }
        else{
            booking(req.body,req.session.user_id,req.query.cab_no).then((result) => {res.redirect("/profile/invoice")})
        }
    },
    payment : (req, res) => {
        if(req.method == "GET"){
            let content = renderTemplate("payment",{isAuthenticated : req.identity.isAuthenticated,ride_otp: req.query.ride_otp,cost: cost});
            res.send(content);
            
        }
        else{
            res.redirect("/profile/invoice?ride_otp="+req.query.ride_otp)
        }
    },
    userBookings: (req,res)=>{
        let page = {page : 1}
        console.log(req.query + Object.keys(req.query).length);
        if(req.method == "GET"){
            if(Object.keys(req.query).length != 0){
                page = req.query;
            }
            viewAllBookings(parseInt(page.page),req.session.user_id).then((body)=>{
                let prevPage = page.page<=1?1:parseInt(page.page)-1;
                let nextPage = page.page>=body.pages?body.pages:parseInt(page.page)+1;
                let info = {
                    data : body,
                }
                let data = {
                    info : info.data,
                    isAuthenticated : req.identity.isAuthenticated,
                    prevPage : prevPage,
                    currentPage : parseInt(page.page),
                    nextPage : nextPage,
                }
                console.log("hi");
                console.log(data.info.data);
                let content = renderTemplate("userBooking",data);
                res.send(content);
                })
        }
    },
    invoicepdf : async(req, res) => {
        if(req.method == "GET"){
            const result = await db.Bookride.findByPk(req.query.ride_otp,{
                include : {
                    model : db.Location,
                    required : true
                }
            })
            console.log(result);
            let content = renderTemplate("invoicepdf",{data : result.dataValues });
            const options = {
                format: "A4",
                headerTemplate: "<p></p>",
                footerTemplate: "<p></p>",
                displayHeaderFooter: false,
                margin: {
                  top: "40px",
                  bottom: "0px",
                },
                printBackground: true
              };
            const finalHtml = encodeURIComponent(content);

            const browser = await puppeteer.launch({
            args: ["--no-sandbox"],
            headless: true,
            });
            const page = await browser.newPage();
            await page.goto(`data:text/html;charset=UTF-8,${finalHtml}`, {
            waitUntil: "networkidle0",
            });
            const pdf = await page.pdf(options);
            res.set({ 'Content-Type': 'application/pdf', 'Content-Length': pdf.length })
            res.send(pdf);  
                }
            }
}