const {Sequelize,DataTypes, TIME} = require('sequelize');
const sequelize = new Sequelize("cms_v2","root","pass@123",{
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
        type : DataTypes.STRING(1),
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
    admin : {
        type : DataTypes.INTEGER,
        allowNull : false
    }
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
const Driver = sequelize.define("driver",{
    
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
    mobile : {
        type : DataTypes.STRING(10),
        allowNull : false
    },
    gender : {
        type : DataTypes.STRING(1),
        allowNull : false,
    },
    dob : {
        type : DataTypes.DATE,
        allowNull : false
    },
    cab_no :{
        type : DataTypes.INTEGER,
        allowNull : true
    }
})
const Bookride = sequelize.define("bookride",{
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
    cost : {
        type : DataTypes.INTEGER,
        allowNull : false
    },
    cab_no : {
        type : DataTypes.INTEGER,
        allowNull : true
    },
    user_id : {
        type : DataTypes.INTEGER,
        allowNull : true
    }
})
module.exports = {
    Customer,
    Cab,
    Driver,
    Bookride
}