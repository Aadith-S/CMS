const db = require("../model/passenger");

module.exports = async (req, res,next)=>{
    req.identity = {
        isAuthenticated: false,
        user : null
    }
    console.log(req.url);
    if(req.url == "/login" || req.url == "/signup"){
        return next();
    }

    let user_id = req.session.user_id;
    if(!user_id || user_id == null){
        if(req.url == "/index"){
            return next();
        }
       return res.redirect("/login") 
    }
    var userDetails = await db.Customer.findByPk(user_id);
    if(!userDetails || userDetails == null){
        return res.redirect("/login")
    }
    else{    
    req.identity.isAuthenticated = true;
    req.identity.user = {
        f_name : userDetails.f_name,
        l_name : userDetails.l_name,
        user_name : userDetails.user_name,
        email : userDetails.email,
        mobile : userDetails.mobile,
        dob : userDetails.dob,
        gender : userDetails.gender,
        admin : userDetails.admin
    };
    console.log("Yes");
    if(req.session.driver == 1){
        console.log(req.url);
        if(req.url.startsWith("/driver") || req.url == "/index"||req.url == "/logout"){
            return next();
        }
        else{
            return res.redirect("/driver/profile");
        }
    }
    else{
        console.log("In admin");
        if(req.session.admin == 0){
            if(req.url.startsWith("/admin")){
                return res.redirect("/profile");
            }
            else{
                return next();
            }
        }
        else{
            console.log("line 51");
            return next();
        }
    }
    }
}