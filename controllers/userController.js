const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel")


exports.register= async (req,res)=>{

    try{

        const { error } = registerSchema.validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);
        //Check if the user is already in the db
        const emailExists = await userModel.findOne({ email: req.body.email });
  
        if (emailExists) return res.status(400).json({
            message: "Email already exists",
            status:'failed'
        })
  
        //hash passwords
        const signupType = req.body.signupType;
        if(signupType != "guest"){
            var salt = await bcrypt.genSalt(10);
            var hashPassword = await bcrypt.hash(req.body.password, salt);
        }
        



        const userRegister = new userModel({
        _id:mongoose.Types.ObjectId(),
        email:req.body.email,
        password:hashPassword,
        userName:req.body.userName,
        blockStatus:req.body.blockStatus,
        fcmToken:req.body.fcmToken,
        signupType:req.body.signupType,
        })

        const registeredUser = await userRegister.save();
       
        if(registeredUser){
            const token = jwt.sign({ _id: registeredUser._id }, process.env.TOKEN)
            res.json({
                message: "User has been Registered" ,
                result:registeredUser,
                statusCode:201,
                token:token
            })
        }
        else{
            res.json({
                message:"User could not be registered",
                result: result,
                statusCode:400
            })
        }

    }
    catch(e){
        res.json({
            message : "Error occurred while registering User",
            error: e.message,
            statusCode:404

        })
    }
}


exports.login = async (req,res)=>{
    const { error } = loginSchema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    
  
    const user = await userModel.findOne({ email: req.body.email });
  
    if (!user) return res.status(400).json({
        message: "Email or Password is incorrect",
        status:"failed"
    });
  
    const validPass = await bcrypt.compare(req.body.password, user.password);

    if (!validPass) return res.status(400).json({
        message: "Email or Password is incorrect",
        status:"failed"
    });;

    const token = jwt.sign({ _id: user._id}, process.env.TOKEN);

    res.json({
        message: "Logged in successfully", 
        result:user,
        token: token,
        status:"success",
        
    })


}


exports.checkLogin=(req,res)=>{
    
}


exports.getAllUsers = async (req,res)=>{

    try{
        const users = await userModel.find({});
        if(users){
            res.json({
                message: "All users fetched successfully",
                result: users,
                status:"success",
                statusCode:200
            })
        }
        else{
            res.json({
                message: "users could not be fetched",
                result:result,
                statusCode:404
            })
        }
    }
    catch(error){
        res.json({
            message: "error occurred while fetching users" ,
            error:error.message
        })
    }
}

exports.getSpecificUser = async(req, res)=>{
    try{
        const result = await userModel.findOne({_id:req.params.user_id})
        if(result){
            res.json({
                message: "User has been fetched",
                result: result,
                statusCode:200
            })
        }
        else{
            res.json({
                message:"User could not be fetched",
            })
        }
    }
    catch(err){
        res.json({
            message: "error occurred while getting user",
            error:err.message,
            statusCode:500
        })
    }
}

exports.deleteUser = async(req, res)=>{
    try{
        const user_id = req.params.user_id;
        const result = await userModel.deleteOne({_id: user_id})
        if(result.deletedCount>0){
            res.json({
                message: "user deleted successfully",
                result:result
            })
        }
        else{
            res.json({
                message: "could not delete user , user with this id may not exist",
                result:result
            })
        }
        
     }
     catch(err){
        res.json({
            message: "Error occurred while deleting user",
            error:err.message,
            statusCode:500
        })
     }
}


exports.updateUser = async (req,res)=>{
    try{
        const user_id = req.body.user_id
        const email = req.body.email
        const blockStatus = req.body.blockStatus
        const user_name = req.body.user_name;
        const fcmToken = req.body.fcmToken;
        const signupType = req.body.signupType;


        

        userModel.findOneAndUpdate({user_id:user_id},
            {
                email:email,
                blockStatus:blockStatus,
                user_name:user_name,
                fcmToken:fcmToken,
                signupType:signupType,
            },
            {
                new:true
            }
            ,function(err, result){
                if(result){
                    res.json({
                        message: "updated successfully",
                        result: result,
                        statusCode:200
                    })
                }
                else{
                    res.json({
                        message: "failed to update successfully",
                        result: result
                    })
                }
            }
            
            )
    }
    catch(err){
        res.json({
            message:"error occurred while updating successfully",
            Error:err.message
        })
    }
}

exports.updatePassword =async (req,res)=>{
    try{
        const email = req.body.email;

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(req.body.password, salt);


        const result = await userModel.findOneAndUpdate({email: email} ,
            {
                password:hashPassword
            },
            {
                new:true
            }) 

            if(result){
                res.json({
                    message: "Password has been updated",
                    result:result
            })
            }
            else{
                res.json({
                    message: "Password could not be updated successfully",
                    result:null
                })
            }
    }
    catch(err){
        res.json({
            message: "Error occurred while updating passwords",
            error:err.message
        })
    }
}

exports.updateSubscribedStatus = async(req, res)=>{
    try{
        const user_id = req.body.user_id;
        const subscribedStatus= req.body.subscribedStatus;
        
        const result = await userModel.findOneAndUpdate({_id:user_id}  , {subscribedStatus:subscribedStatus} , {new:true});
        if(result){
            res.json({
                message: "User subscribed Status has been changed",
                status:true,
                result: result
            })
        }
        else{
            res.json({
                message: "Could not update status of subscription",
                result:null,
                status:false
            })
        }
    
    }
    catch(err){
        res.json({
            message: "Error Occurred while updating subscription",
            error: err.message,
            status:false
        })
    }
}


const registerSchema = Joi.object({
  user_name: Joi.string(),
  email: Joi.string().min(6).email(),
  password: Joi.string().min(6),
  blockStatus: Joi.boolean(),
  fcmToken: Joi.string(),
  signupType: Joi.string(),
});

const loginSchema = Joi.object({
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required(),
});
