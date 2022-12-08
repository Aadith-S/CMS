const db = require("../model/passenger");
const renderTemplate = require("../views/view")
function viewAllBookings(page,id){
    return new Promise((res,rej)=>{
        db.Bookride.findAll({
    include:
    [{
        model : db.Cab,
        required : true,
        include : { model : db.Customer,
                    required : true,
                    where : { user_id : id}
                }
        },
        {
            model : db.Customer,
            required : true
        },
        {
            model : db.Location,
            required : true
        }
    ]}
    ).then((result)=>{
            let data = [];
            let pages = Math.ceil(result.length/5)
            if(page<1){
                page = 1;
            }
            else if(page>pages){
                page = pages;
            }
            console.table(result);
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
                pages : pages
            }
            res(body);
        })
    })
}
module.exports = {
    profile : async(req,res)=>{
        let info = {
            info : req.identity.user,
            isAuthenticated : req.identity.isAuthenticated,
            id : req.session.user_id
        }
        console.log(info);
        let content = renderTemplate('driverprofile',info);
        res.send(content);
    },
    driverBookings: (req,res)=>{
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
                let content = renderTemplate("dallbookings",data);
                res.send(content);
                })
        }
    },
    update : (req,res)=>{
        if(req.method == 'POST'){
            driverUpdate(req.query.driver_id,req.body).then((result)=>{
                res.redirect("/driver/profile");
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
        deleteDriver(req.query.driver_id).then((result)=>{res.redirect("/driver/profile");}).catch((err)=>{console.log(err);});
        }
        else{
            let content = renderTemplate("DriverDelete",{isAuthenticated : req.identity.isAuthenticated,driver_id: req.query.driver_id});
            res.send(content);
        }
    },
}
