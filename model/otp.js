const mongoose = require('mongoose');

const UserSchemaTwo = new mongoose.Schema({
        email:{
            type:String,
        },
        code:{
            type:String,
        },
        expireIn:{
            type:String,
        }

},{collection:'otp'});

const otp = mongoose.model('otp', UserSchemaTwo);
module.exports = otp;