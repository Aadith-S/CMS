const db = require("./model/passenger");

module.exports = async (req, res,next)=>{
    req.identity = {
        isAuthenticated: false,
        user : null
    }
    if(req.url == "/login" || req.url == "/signup"){
        return next();
    }

    let user_id = req.session.user_id;
    console.log(user_id);
    if(!user_id || user_id == null){
       return res.redirect("/login") 
    }
    let userDetails = await db.Customer.findByPk(user_id);
    if(!userDetails || userDetails == null){
        return res.redirect("/login")
    }
    req.identity.isAuthenticated = true;
    req.identity.user = {
        f_name : userDetails.f_name,
        l_name : userDetails.l_name,
        user_name : userDetails.user_name,
        email : userDetails.email,
        mobile : userDetails.mobile,
        dob : userDetails.dob,
        gender : userDetails.gender
    };
    return next();
}