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
        type : DataTypes.BOOLEAN,
        allowNull : false
    },
    driver : {
        type : DataTypes.BOOLEAN,
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
    driver_id :{
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
        type : DataTypes.DATEONLY,
        allowNull : false
    },
    date_of_ride : {
        type : DataTypes.DATEONLY,
        allowNull : true
    },
    location_id : {
        type : DataTypes.INTEGER,
        allowNull : false
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
const Location = sequelize.define("location",{
    location_id : {
        type : DataTypes.INTEGER,
        primaryKey : true,
        autoIncrement : true
    },
    pickup : {
        type : DataTypes.STRING(50),
        allowNull : false
    },
    dropoff : {
        type : DataTypes.STRING(50),
        allowNull : false
    },
    cost : {
        type : DataTypes.INTEGER,
        allowNull : false
    }
})
Customer.hasOne(Cab,{
    foreignKey : "driver_id",
    sourceKey : "user_id"
})
Cab.belongsTo(Customer,{
    foreignKey : "driver_id",
    targetKey : "user_id"
})
Customer.hasMany(Bookride,{
    foreignKey : "user_id",
    sourceKey : "user_id"
});
Bookride.belongsTo(Customer,{
    foreignKey : "user_id",
    targetKey : "user_id"
})
Cab.hasMany(Bookride,{
    foreignKey : "cab_no",
    sourceKey : "cab_no"
})
Bookride.belongsTo(Cab,{
    foreignKey : "cab_no",
    targetKey : "cab_no"
});
Location.hasMany(Bookride,{
    foreignKey : "location_id",
    sourceKey : "location_id"
})
Bookride.belongsTo(Location,{
    foreignKey : "location_id",
    targetKey : "location_id"
})
module.exports = {
    Customer,
    Cab,
    Bookride,
    Location
}