const db = require("../model/passenger");
const renderTemplate = require("../views/view")

function userUpdate(user_id,details){
    return new Promise((res,rej)=>{
    db.Customer.update(details,{where :{user_id : user_id}}).then((result)=>{console.log(result); res("success")}).catch((err)=>{
        rej(err);
    })
    })
}

function deleteUser(user_id){
    return new Promise((res,rej)=>{
        db.Customer.destroy({where: {user_id: user_id}}).then((result)=>{console.log(result); res("success")}).catch((err)=>{
            rej(err);
    })
    })
}
function cost(date,rideDate){
    return 100;
}
function booking(details){
    return new Promise((res,req)=>{
        let date = new Date();
        console.log(date);
        let data = {
            date_of_booking : date,
            date_of_ride : details.date_of_ride,
            pickup : details.pickup,
            dropoff : details.dropoff,
            ride_time : details.ride_time,
            cost : cost(date.getUTCDate,details.date_of_ride),
            cab_no : details.cab_no,
            user_id : details.user_id
            }
            db.Bookride.create(data).then(result => {res(result)}).catch(err => {console.log(err)});
    })
}

module.exports = {
    profile : (req,res)=>{
        let content = renderTemplate('profile',{});
        res.send(content);
    },
    update : (req,res)=>{
        if(req.method == 'POST'){
            userUpdate(req.query.user_id,req.body).then((result)=>{
                res.send(result);
            }).catch((err)=>{
                console.log(err);
            });
        }
        else{
            let content = renderTemplate("profileUpdate",{});
            res.send(content);
        }
    },
    delete: (req,res)=>{
        if(req.method == 'POST'){
        deleteUser(req.body.user_id).then((result)=>{res.send(result)}).catch((err)=>{console.log(err);});
        }
        else{
            let content = renderTemplate("profileDelete",{});
            res.send(content);
        }
    },
    bookpage : (req, res) => {
        if(req.method == "GET"){
            let content = renderTemplate("booking",info);
                res.send(content);
        }
        else{
            booking(req.body).then((result) => {res.send(result)})
        }
    }
}