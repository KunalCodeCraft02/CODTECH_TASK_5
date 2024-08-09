const mongoose = require('mongoose');

let userSchma = mongoose.Schema({
    username:String,
    email:String,
    password:String,
    name:String,
    bio:String,
    profilePic:{
        type:String,
        default:""
    },
    post:[
        {type:mongoose.Schema.Types.ObjectId,ref:"post"}
    ]

});

module.exports = mongoose.model("user",userSchma)