const db = require("../model/passenger");
const renderTemplate = require("../views/view")
function authentication(uname,pass)
{   return new Promise((resolve, reject) =>{
    db.Customer.findAll({where : {
        user_name : uname,
        password : pass
        },
    attributes : ["user_id"]}).then((result)=>{
            console.log(result);
            if(result.length == 0)
            {
                reject(); 
            }
            else{
            console.log("Logged In Successfully");
            resolve();
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
        gender : parseInt(user.Gender),
        address : user.addr,
        dob : user.dob,
        mobile : user.pNo,
        email : user.email,
        user_name : user.userName,
        password : user.pass,
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
        attributes : ["cab_no","cab_name","cab_description","cab_totalSeating"]}).then((result)=>{
            let data = [];
            let pages = Math.ceil(result.length/5)
            if(page<1){
                page = 1;
            }
            else if(page>pages){
                page = pages;
            }
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
function driverdetails(cab_no = 1){
    return new Promise((res,rej)=>{
        db.Driver.findByPk(cab_no).then((result)=>{
            res(result);
        }).catch((err)=>{console.log(err)})
    })
}

module.exports = {
    index : (req,res,next) => {
    let content = renderTemplate("index",{});
    res.send(content);},
    login : (req,res)=>{
        console.log(req.body);
        if(req.method == "GET"){
        let content = renderTemplate("login",{});
        res.send(content);
        }
        else{
        authentication(req.body.userName,req.body.passWord).then(()=>res.redirect("/profile")).catch(()=>{let content = renderTemplate("login",{err : "Incorrect Username or Password"});
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
                let content = renderTemplate("searchCab",info);
                res.send(content);
                })
        }
    },
    driverDetails : (req,res)=>{
        if(req.method == "GET"){
            res.send("hlooo");
        }
        else{
            driverdetails(req.query.cab_no).then((result)=>{
                console.log(result.dataValues);
                res.json(result.dataValues);
            });
        }
    }
}