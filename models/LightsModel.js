const  mongoose = require('mongoose');

const lightSchema = new mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    name:{
        type:String,
    },
    status:{
        type:Boolean,
        default:false
    }
    
})

module.exports = mongoose.model ("light" ,  lightSchema)