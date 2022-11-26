const db = require("../model/passenger")
db.Customer.hasMany(db.Bookride,{
    foreignKey : "user_id"
});
db.Bookride.belongsTo(db.Customer,{foreignKey : "user_id"})
db.Cab.hasMany(db.Bookride,{
    foreignKey : "cab_no"
});
db.Bookride.belongsTo(db.Cab,{foreignKey : "cab_no"})
db.Cab.hasOne(db.Driver,{
    foreignKey : "cab_no"
});
db.Driver.belongsTo(db.Cab,{
    foreignKey : "cab_no"
});
db.Customer.sync({alter: true});
db.Cab.sync();
db.Bookride.sync();
db.Driver.sync({alter: true});
