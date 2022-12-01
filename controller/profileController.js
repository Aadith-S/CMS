const db = require("../model/passenger");
const renderTemplate = require("../views/view")
function viewAllBookings(page,user_id){
    return new Promise((res,rej)=>{
        db.Bookride.findAll({
    include:
    {
        model : db.Cab,
        required : true,
        include : { model : db.Driver,
                    required : true,
                },
    },
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
            console.table(result);
            for(let i = 5*(page-1);i<5*page && i<result.length;i++){
                data.push(result[i].dataValues)
                console.log(data[0].cab.dataValues.driver.dataValues);
            }
            let body ={
                data : data,
                pages : pages
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
function cost(date,rideDate){
    return 100;
}
function booking(details,user_id,cab_no){
    return new Promise((res,req)=>{
        let date = new Date();
        console.log(user_id);
        console.log(cab_no);
        let data = {
            date_of_booking : date,
            date_of_ride : details.date_of_ride,
            pickup : details.pickup,
            dropoff : details.dropoff,
            ride_time : details.ride_time,
            cost : cost(date.getUTCDate,details.date_of_ride),
            cab_no : parseInt(cab_no),
            user_id : user_id,
            }
            db.Bookride.create(data).then(result => {res(result)}).catch(err => {console.log(err)});
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
            db.Bookride.findByPk(req.query.ride_otp).then((result) => { console.log(result); let content = renderTemplate("invoice",{isAuthenticated : req.identity.isAuthenticated,data : result.dataValues });
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
    }
}