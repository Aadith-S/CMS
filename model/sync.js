const db = require("../model/passenger")

db.Customer.sync();
db.Cab.sync();
db.Bookride.sync();
db.Driver.sync();