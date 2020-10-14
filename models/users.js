var mongoose = require("mongoose");

var schema= mongoose.Schema;
var  userSchema= new schema ({
    "fname": String,
    "lname": String,
    "mobile": Number,
    "email": String,
    "city": String,

     "username": String,
     "password": String,

})
module.exports= mongoose.model('user',userSchema,'client_1');