const db = require("../model/passenger");
const renderTemplate = require("../views/view")

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
    db.Cab.findByPk(driver.cab_no).catch((err)=>{rej(err)})
    db.Driver.create({
        driver_id : driver.id,
        driver_name : driver.driver_name,
        driver_address : driver.driver_address,
        cab_no: driver.cab_no,
        gender : driver.gender,
        dob : driver.dob,
        mobile : driver.mobile
    }).then((result)=>{res(result)}); 
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
            let content = renderTemplate("signup",{});
            res.send(content);
        }
        else{

        }
    }
}