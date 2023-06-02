const  mongoose = require("mongoose");

const dashBoardSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    sensors:{
        temperature:String,
        PH_level : String,
        humidity: String,
        water_level: String,
        NPK:{
        N:String,
        P:String,
        K:String
        }
    }
    
})

module.exports = mongoose.model("dashBoard", dashBoardSchema);
