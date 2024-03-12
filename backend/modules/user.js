const mongoose = require('mongoose');


module.exports = mongoose.model('User',
 { userid:String, email: String, password: String, otp: Number ,  });