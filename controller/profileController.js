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

module.exports = {
    update : (req,res)=>{
        userUpdate(req.query.user_id,req.body).then((result)=>{
            res.send(result);
        }).catch((err)=>{
            console.log(err);
        });
    },
    delete: (req,res)=>{
        deleteUser(req.body.user_id).then((result)=>{res.send(result)}).catch((err)=>{console.log(err);});
    },
    
}