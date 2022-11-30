const db = require("../model/passenger")

db.Bookride.belongsTo(db.Cab,{foreignKey : "cab_no"})
db.Customer.sync();
db.Driver.sync();
db.Cab.sync({alter : true});
db.Bookride.sync();
