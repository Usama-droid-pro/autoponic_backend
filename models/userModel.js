
const mongoose = require("mongoose")
const userSchema = new mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    user_name:String,
    email:String,
    password:String,
    signupType:{
        type:String,
        enum:["email" , "google"]
    },
    blockStatus:{
        type:Boolean
    },
    fcmToken:String,
    subscribedStatus:Boolean


})

module.exports=mongoose.model("user" , userSchema);

