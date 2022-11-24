const db = require("../model/passenger")
db.Customer.hasMany(db.Bookride,{
    foreignKey : "user_id"
});
db.Cab.hasMany(db.Bookride,{
    foreignKey : "cab_no"
});
db.Cab.hasOne(db.Driver,{
    foreignKey : "cab_no"
});
db.Customer.sync();
db.Cab.sync();
db.Bookride.sync();
db.Driver.sync();
