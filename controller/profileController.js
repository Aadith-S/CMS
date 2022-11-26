const db = require("../model/passenger");
const renderTemplate = require("../views/view")

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
            role : details.role
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
            booking(req.body,req.session.user_id,req.query.cab_no).then((result) => {res.send(result)})
        }
    }
}