const {Sequelize,DataTypes, TIME} = require('sequelize');
const sequelize = new Sequelize("cms","root","pass@123",{
    host: 'localhost',
    dialect : "mysql"
})
const Customer = sequelize.define("customer",{
    user_id : {
        type : DataTypes.INTEGER,
        primaryKey : true,
        autoIncrement : true
    },
    f_name : {
        type : DataTypes.STRING(50),
        allowNull : false
    },
    l_name : {
        type : DataTypes.STRING(50),
        allowNull : false
    },
    gender : {
        type : DataTypes.INTEGER,
        allowNull : false,
        
    },
    address : {
        type : DataTypes.STRING(100),
        allowNull : true
    },
    dob : {
        type : DataTypes.DATE,
        allowNull : true
    },
    mobile : {
        type : DataTypes.STRING(10),
        allowNull : false
    },
    email : {
        type : DataTypes.STRING(50),
        unique : true
    },
    user_name : {
        type : DataTypes.STRING(50),
        allowNull : false
    },
    password :{
        type : DataTypes.STRING(50),
        allowNull : false
    },
})
const Cab = sequelize.define("cab",{
    cab_no : {
        type : DataTypes.INTEGER,
        primaryKey : true,
        autoIncrement : true
    },
    cab_name : {
        type : DataTypes.STRING(150),
        allowNull : false
    },
    cab_description : {
        type : DataTypes.STRING(150),
        allowNull : false
    },
    cab_totalSeating : {
        type : DataTypes.STRING(150),
        allowNull : false
    },
    etc : {
        type : DataTypes.STRING(150),
        allowNull : true
    }
})
const cab_schedule = sequelize.define("cab_schedule", {
    schedule_id : {
        type : DataTypes.INTEGER,
        primaryKey : true,
        autoIncrement : true
    },
    pickup : {
        type : DataTypes.STRING(150),
        allowNull : false
    },
    dropoff : {
        type : DataTypes.STRING(150),
        allowNull : false
    },
    ride_date : {
        type : DataTypes.DATE,
        allowNull : true
    },
    ride_time : {
        type : DataTypes.TIME,
        allowNull : true
    },
    cost : {
        type : DataTypes.INTEGER,
        allowNull : false
    },
    cab_no : {
        type : DataTypes.INTEGER,
        references : {
            model : "cab",
            key : "cab_no"
        },
        allowNull : true
    }
});
const driver = sequelize.define("driver",{
    
    driver_id : {
        type : DataTypes.INTEGER,
        primaryKey : true,
        autoIncrement : true
    },
    driver_name : {
        type : DataTypes.STRING(50),
        allowNull : false
    },
    driver_address : {
        type : DataTypes.STRING(100),
        allowNull : false
    },
    cab_no : {
        type : {
            type : DataTypes.INTEGER,
            references : {
                model : "cab",
                key : "cab_no"
            },
            allowNull : true
        }
    }
})
const bookride = sequelize.define("bookride",{
    ride_otp :{
        type : DataTypes.INTEGER,
        primaryKey : true,
        autoIncrement : true
    },
    date_of_booking : {
        type : DataTypes.DATE,
        allowNull : false
    },
    date_of_ride : {
        type : DataTypes.DATE,
        allowNull : true
    },
    pickup : {
        type : DataTypes.STRING(50),
        allowNull : true
    },
    dropoff : {
        type : DataTypes.STRING(50),
        allowNull : true
    },
    ride_time : {
        type : DataTypes.TIME,
        allowNull : true
    },
    cab_no : {
        type : DataTypes.INTEGER,
        references : {
            model : "cab",
            key : "cab_number"
        },
        allowNull : true
    },
    user_id : {
        type : DataTypes.INTEGER,
        references : {
            model : "user",
            key : 'user_id'
        },
        allowNull : true
    }
})
Customer.sync();
Cab.sync();
// authentication("aadi","pass@123").catch(()=>{console.log("HEllo");})
function authentication(uname,pass)
{   return new Promise((res,rej)=>{
    user.findAll({where : {
        user_name : uname,
        password : pass
        },
    attributes : ["user_id"]}).then((result)=>{
            console.log(result);
            if(result.length == 0)
            {
                rej(0)
            }
            else{
            console.log("Logged In Successfully");
            res(1);
            }
        }).catch(err=>{
            console.log("Error: " + err);
        })
    })
}
function addCustomer(user){
        Customer.create({
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
        })
}
// let usr = {
//     firstName : 'John',
//     lastName : 'Doe',
//     Gender : 1,
//     addr : '123 Main St.',
//     dob : "2000-01-01",
//     pNo : '123123123',
//     email : "john@example.com",
//     userName : "Johnny",
//     pass : "123123123"
// }
// addCustomer(usr)
function getCab(page){
    return new Promise((res,rej)=>{
        Cab.findAll({
        attributes : ["cab_no","cab_name","cab_description","cab_totalSeating"]}).then((result)=>{
            let data = [];
            // console.log(result);
            // result.forEach(n=>{
            //     data.push(n.dataValues);
            // })
            for(let i = 5*(page-1);i<5*page && i<result.length;i++){
                data.push(result[i].dataValues)
            }
            console.log(data);
            res(data);
        })
    })
}
module.exports = {
    authentication : authentication,
    addCustomer : addCustomer,
    getCab : getCab
}
// user.findAll().then((result=>{
//     result.forEach(n=>{
//         console.log(n.dataValues);
//     })
// })).catch(err=>{
//     console.error(err);
// })