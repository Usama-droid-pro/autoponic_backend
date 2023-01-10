
const mongoose = require("mongoose")
const lightsModel = require("../models/LightsModel")


exports.createLight = async (req,res)=>{

    try{
        const name = req.body.name;
        if(name==""){
            return(
                res.json({
                    message: "name could not be empty",
                    status:false
                })
            )
        }


        const foundName = await lightsModel.findOne({name:  { 
            "$regex": "^" + name + "\\b", "$options": "i"
        }});
        if(!foundName) {

            const newLight = await lightsModel({
                _id:mongoose.Types.ObjectId(),
                name:name,
    
            })

            const result = await newLight.save();

        if(result){
            res.json({
                message: "New light has been created successfully",
                result: result,
                status: 'success',
            })
        }
        else{
            res.json({
                message: "Could not create new light",
                status: "failed"
            })
        }
        }
        else{
            res.json({
                message: "This name already exists",
                status:false
            })
        }
        

        
    }
    catch(err){
        res.json({
            message: "Error creating light",
            error:err.message
        })
    }
}

exports.getAllLights = async(req,res)=>{
    try{
        const result= await lightsModel.find({});
        if(result){
            res.json({
                message: "lights fetched",
                result: result,
                status: 'success',
            })
        }
        else{
            res.json({
                message: "Could not fetch lights",
                status: "failed"
            })
        }
        
        
    }
    catch(err){
        res.json({
            message: "Error fetching lights",
            error:err.message
        })
    }
}

exports.getLightById = async (req,res)=>{
    try{
        const light_id = req.query.light_id;

        const result = await lightsModel.findOne({_id: light_id});
        if(result){
            res.json({
                message: "light fetched",
                success: true,
                status: result.status,
            })
        }
        else{
            res.json({
                message: "Could not fetch light",
                success: false
            })
        }
        
    }
    catch(err){
        res.json({
            message: "Error fetching ",
            error:err.message
        })
    }
}

exports.deleteLight = async(req,res)=>{
    try{
        const light_id = req.query.light_id;

        const result= await lightsModel.deleteOne({_id: light_id})

        if(result.deletedCount>0){
            res.json({
                message: "Deleted",
                result:result
            })
        }
        else{
            res.json({
                message: "could not deleted",
                status:"failed"
            })
        }
    }
    catch(err){
        res.json({
            message: "Error",
            error:err.message
        })
    }
}

exports.updateLight = async (req,res)=>{

    try{
        const name  = req.body.name;
        const status = req.body.status;

         var result = await lightsModel.findOneAndUpdate({name:name} , {status:status} , {new:true});

        if(result){
            res.json({
                message: "light updated successfully",
                result:result,
                status: 'success'
            })
        }
        else{
            res.json({
                message: "could not updated",
                result:null,
                status:"false"
            })
        }
    }
    catch(err){
        res.json({
            message: "error",
            error:err.message
        })
    }
}