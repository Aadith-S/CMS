const db = require("../model/passenger")
db.Customer.hasMany(db.Bookride,{
    foreignKey : "user_id"
});
db.Bookride.belongsTo(db.Customer,{foreignKey : "user_id"})
db.Cab.hasMany(db.Bookride,{
    foreignKey : "cab_no"
});
db.Bookride.belongsTo(db.Cab,{foreignKey : "cab_no"})
db.Driver.hasOne(db.Cab,{
    foreignKey : "driver_id"
});
db.Cab.belongsTo(db.Driver,{
    foreignKey : "driver_id"
});
db.Customer.sync();
db.Driver.sync();
db.Cab.sync();
db.Bookride.sync();
