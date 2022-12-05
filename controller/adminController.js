const db = require("../model/passenger");
const renderTemplate = require("../views/view")
const cc = require("./customerController")
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
    }
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
function viewAllUsers(page){
    return new Promise((res,rej)=>{
        db.Customer.findAll({
        attributes : ["user_id","user_name","f_name","l_name","email","gender","address","dob","mobile"]}).then((result)=>{
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
            }
            let body ={
                data : data,
                pages : pages
            }
            res(body);
        })
    })
}
function viewAllDrivers(page){
    return new Promise((res,rej)=>{
        db.Driver.findAll().then((result)=>{
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
            }
            let body ={
                data : data,
                pages : pages
            }
            res(body);
        })
    })
}
function assignDriver(cab_no,driver_id){
    return new Promise((res,rej)=>{
        console.log(cab_no);
        console.log(driver_id);
        db.Cab.update(driver_id,{where :{cab_no:cab_no}}).then((result)=>{console.log(result); res("success")}).catch((err)=>{
            rej(err);
        })
        })
}
function getCab(page){
    return new Promise((res,rej)=>{
        db.Cab.findAll({include : {
            model : db.Driver,
            required : true
        }}).then((result)=>{
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
            }
            let body ={
                data : data,
                pages : pages
            }
            res(body);
        })
    })
}
function driverUpdate(driver_id,details){
    return new Promise((res,rej)=>{
    db.Driver.update(details,{where :{driver_id :driver_id}}).then((result)=>{console.log(result); res("success")}).catch((err)=>{
        rej(err);
    })
    })
}

function deleteDriver(driver_id){
    return new Promise((res,rej)=>{
        db.Driver.destroy({where: {driver_id:driver_id }}).then((result)=>{console.log(result); res("success")}).catch((err)=>{
            rej(err);
    })
    })
}
function addDriver(driver){
    return new Promise((res,rej)=>{
    db.Driver.create({
        driver_name : driver.driver_name,
        driver_address : driver.driver_address,
        gender : driver.gender,
        dob : driver.dob,
        mobile : driver.mobile
    }).then((result)=>{res(result)}); 
})
}
function addCab(cab){
    return new Promise((res,rej)=>{
    db.Cab.create({
        cab_name : cab.cab_name,
        cab_description : cab.cab_description,
        cab_totalSeating : cab.cab_totalSeating
    }).then((result)=>{res(result)}); 
})
}
function delCab(cab_no){
    return new Promise((res,rej)=>{
        db.Cab.destroy({where: {cab_no:cab_no}}).then((result)=>{console.log(result); res("success")}).catch((err)=>{
            rej(err);
    })
    })
}
module.exports = {
    viewAllUsers: (req, res)=>{
        let page = {page : 1}
        console.log(req.query + Object.keys(req.query).length);
        if(req.method == "GET"){
            if(Object.keys(req.query).length != 0){
                page = req.query;
            }
            viewAllUsers(parseInt(page.page)).then((body)=>{
                let prevPage = page.page<=1?1:parseInt(page.page)-1;
                let nextPage = page.page>=body.pages?body.pages:parseInt(page.page)+1;
                let info = {
                    data : body.data,
                    prevPage : prevPage,
                    currentPage : parseInt(page.page),
                    nextPage : nextPage,
                }
                let data = {
                    info : info,
                    isAuthenticated : req.identity.isAuthenticated
                }
                let content = renderTemplate("Allusers",data);
                res.send(content);
                })
        }
    },
    viewAllDrivers: (req, res)=>{
        let page = {page : 1}
        console.log(req.query + Object.keys(req.query).length);
        if(req.method == "GET"){
            if(Object.keys(req.query).length != 0){
                page = req.query;
            }
            viewAllDrivers(parseInt(page.page)).then((body)=>{
                let prevPage = page.page<=1?1:parseInt(page.page)-1;
                let nextPage = page.page>=body.pages?body.pages:parseInt(page.page)+1;
                let info = {
                    data : body.data,
                    prevPage : prevPage,
                    currentPage : parseInt(page.page),
                    nextPage : nextPage,
                }
                let data = {
                    info : info,
                    isAuthenticated : req.identity.isAuthenticated
                }
                let content = renderTemplate("allDrivers",data);
                res.send(content);
                })
        }
    },
    update : (req,res)=>{
        if(req.method == 'POST'){
            driverUpdate(req.query.driver_id,req.body).then((result)=>{
                res.redirect("/SearchCabs?driver_id="+req.query.driver_id);
            }).catch((err)=>{
                console.log(err);
            });
        }
        else{
            let content = renderTemplate("driverUpdate",{isAuthenticated : req.identity.isAuthenticated,driver_id: req.query.driver_id});
            res.send(content);
        }
    },
    delete: (req,res)=>{
        if(req.method == 'POST'){
        deleteDriver(req.query.driver_id).then((result)=>{res.redirect("/SearchCabs");}).catch((err)=>{console.log(err);});
        }
        else{
            let content = renderTemplate("DriverDelete",{isAuthenticated : req.identity.isAuthenticated,driver_id: req.query.driver_id});
            res.send(content);
        }
    },
    add : (req,res)=>{
        if(req.method == 'GET'){
            let content = renderTemplate("driveradd",{isAuthenticated : req.identity.isAuthenticated});
            res.send(content);
        }
        else{
            addDriver(req.body).then(() =>res.redirect("/admin/viewAllDrivers")).catch(() =>res.redirect("/driverAdd"));
        }
    },
    assignDriver : (req, res) =>{
        if(req.method == 'GET'){
            let page = {page : 1}
        console.log(req.query + Object.keys(req.query).length);
        if(req.method == "GET"){
            if(Object.keys(req.query).length != 0){
                page = req.query;
            }
            viewAllDrivers(parseInt(page.page)).then((body)=>{
                let prevPage = page.page<=1?1:parseInt(page.page)-1;
                let nextPage = page.page>=body.pages?body.pages:parseInt(page.page)+1;
                let info = {
                    data : body.data,
                    prevPage : prevPage,
                    currentPage : parseInt(page.page),
                    nextPage : nextPage,
                }
                let data = {
                    info : info,
                    isAuthenticated : req.identity.isAuthenticated,
                }
                req.session.cab_no = req.query.cab_no;
                console.log(req.session);
                let content = renderTemplate("driverAssign",data);
                res.send(content);
                })
        }
        }
    },
    selectCab : (req, res) =>{
        console.log(req.query);
        if(req.method == 'GET'){
            let page = {page : 1}
        if(req.method == "GET"){
            if(Object.keys(req.query).length != 0){
                page = req.query;
            }
            getCab(parseInt(page.page)).then((body)=>{
                let prevPage = page.page<=1?1:parseInt(page.page)-1;
                let nextPage = page.page>=body.pages?body.pages:parseInt(page.page)+1;
                let info = {
                    data : body.data,
                    prevPage : prevPage,
                    currentPage : parseInt(page.page),
                    nextPage : nextPage,
                }
                let data = {
                    info : info,
                    isAuthenticated : req.identity.isAuthenticated,
                }
                console.log(req.session);
                let content = renderTemplate("cabAssign",data);
                res.send(content);
                })
        }
        }
    },
    cabAssign : (req,res)=>{
        if(req.method == 'GET'){
            let driver_id = {
                driver_id : req.query.driver_id
            }
            let cab_no = req.session.cab_no;
            console.log(req.session);
            console.log(cab_no);
            assignDriver(cab_no,driver_id).then(()=>res.redirect("/profile"))
        }
    },
    cabAdd : (req,res)=>{
        if(req.method == 'GET'){
            let content = renderTemplate("addCab",{isAuthenticated : req.identity.isAuthenticated});
            res.send(content);
        }
        else{
            addCab(req.body).then(() =>res.redirect("/admin/selectCab?page=1")).catch(() =>res.redirect("/cabAdd"));
        }
    },
    deletecab: (req,res)=>{
            delCab(req.query.cab_no).then(() =>res.redirect("/admin/selectCab?page=1")).catch(() =>res.redirect("/selectCab?page=1"));
    },
    allBookings: (req,res)=>{
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