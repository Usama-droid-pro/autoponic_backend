const mongoose = require('mongoose');
const { castObject } = require('../models/dashBoardModel');
const dashBoardModel = require("../models/dashBoardModel");

exports.updateDashBoard = async (req,res)=>{
    try{
       
        const sensors = req.body.sensors;

        const foundResult = await dashBoardModel.find();
        if(foundResult.length>0){
            var result = await dashBoardModel.findOneAndUpdate({_id:foundResult[0]._id} ,
                {
                    sensors:sensors
                   
                },
                {
                    new:true
                });
        }
        else if(foundResult.length ==0){

            const newDashBoard = new dashBoardModel({
                _id:mongoose.Types.ObjectId(),
                sensors:sensors
            });
    
            var result = await newDashBoard.save();
        }


        if(result){
            res.json({
                message: "Dashboard record inserted successfully",
                status:true,
                result:result
            })
        }
        else{
            res.json({
                message: "Dashboard record not inserted",
                status:false
            })
        }
        

    }
    catch(err){
        res.json({
            message: err.message,
            status:false
        })
    }
}

exports.getDashBoard = async(req,res)=>{
    try{
        const result = await dashBoardModel.find();
        if(result.length>0){
            res.json({
                message: "Dashboard record found",
                status:true,
                result:result[0]
            })
        }
        else{
            res.json({
                message: "Dashboard record not found",
                status:false
            })
        }
    }
    catch(err){
        res.json({
            message: err.message,
            status:false
        })
    }
}

