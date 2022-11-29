const { Op } = require("sequelize");
const db = require("../model/passenger");
const renderTemplate = require("../views/view")
function authentication(uname,pass)
{   return new Promise((resolve, reject) =>{
    db.Customer.findOne({where : {
        user_name : uname,
        password : pass
        },
    attributes : ["user_id"]}).then((result)=>{
            console.log(result);
            if(result == null)
            {
                reject(); 
            }
            else{
            console.log("Logged In Successfully");
            resolve(result.dataValues.user_id);
            }
        }).catch(err=>{
            console.log("Error: " + err);
        })
})}
function addCustomer(user){
    return new Promise((res,rej)=>{
    db.Customer.create({
        f_name : user.firstName,
        l_name : user.lastName,
        gender : user.Gender,
        address : user.addr,
        dob : user.dob,
        mobile : user.pNo,
        email : user.email,
        user_name : user.userName,
        password : user.pass,
        role : 0
    }).then((result)=>{
        console.log(result);
    }).catch((err)=>{
        console.log("Error: " + err);
    })}
)
}
function getCab(page){
    return new Promise((res,rej)=>{
        db.Cab.findAll({
        attributes : ["cab_no","cab_name","cab_description","cab_totalSeating","driver_id"],where : {driver_id : {[Op.not]:null}}}).then((result)=>{
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
function driverdetails(driver_id){
    return new Promise((res,rej)=>{
        db.Driver.findByPk(driver_id).then((result)=>{
            console.log(result);
            if(result == null){
            res(0);
            }
            else{
                res(result);
            }
        }).catch((err)=>{console.log(err)})
    })
}

module.exports = {
    index : (req,res,next) => {
        let content = renderTemplate("index",{isAuthenticated : req.identity.isAuthenticated});
        res.send(content);
    },
    login : (req,res)=>{
        console.log(req.body);
        if(req.method == "GET"){
        let content = renderTemplate("login",{isAuthenticated : req.identity.isAuthenticated});
        res.send(content);
        }
        else{
        authentication(req.body.userName,req.body.passWord).then((id)=>{req.session.user_id=id; res.redirect("/profile")}).catch(()=>{let content = renderTemplate("login",{err : "Incorrect Username or Password"});
        res.send(content);});
        }
    },
    signup : (req, res) =>{
        if(req.method == "GET"){
            let content = renderTemplate("signup",{});
            res.send(content);
            }
        else{
            addCustomer(req.body).then(() =>res.redirect("/")).catch(() =>res.redirect("/signup"));
            }
    },
    bookride : (req, res)=>{
        let page = {page : 1}
        console.log(req.query + Object.keys(req.query).length);
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
                    admin : req.identity.user.admin
                }
                console.log(data);
                let content = renderTemplate("SearchCab",data);
                res.send(content);
                })
        }
    },
    driverDetails : (req,res)=>{
        if(req.method == "GET"){
            driverdetails(req.query.driver_id).then((result)=>{
                let info = {
                    info : result.dataValues,
                    isAuthenticated : req.identity.isAuthenticated,
                    admin : req.identity.user.admin
                }
                let content = renderTemplate('driverinfo',info);
                res.send(content);
            });
        }
    },
    logout : (req,res)=>{
        req.session.user_id = null;
        res.redirect("/login");
    },
    getCab : getCab
}