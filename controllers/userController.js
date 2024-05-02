import  {User} from "../models/userModel.js";

import  crypto from "crypto";
import {Hospital} from "../models/Hospitl.js"

import {uploadOnCloudinary} from "../utils/cloudinary.js"
import  sendToken  from "../utils/JWTtoken.js";
import { asyncError } from "../middleware/errorMiddleware.js";
import ErrorHandler from "../utils/errorhandler.js";
import { log } from "console";
import {v2 as cloudinary} from "cloudinary"



// register a user
export const registerUser = async(req,res,next) => {
   

    const { name, email, password, age, phone, bloodgrp, gender, address } = req.body;
    console.log(name, email);
    const user = await User.findOne({email:email});

    if(user){
        return res.status(400).json({msg:"User already registered."});
        
    }
    // handling for images
    const avatarLocalpath = req.file?.path;
    if (!avatarLocalpath) {
        return res.status(400).json({ msg: "avatarUrl is required" });
    }
    console.log(avatarLocalpath);
    const avatar = await uploadOnCloudinary(avatarLocalpath);
    if (!avatar || !avatar.url) {
        return res.status(500).json({ msg: "Error uploading avatar" });
    }
    
    console.log(avatar.url);


    
    try {
        const user = await User.create({
            name, email, password, age, phone, bloodgrp, gender, address,
            avatar: avatar.url
        });
        return res.status(201).json({
            success: true,
            user
        });
    } catch (error) {
        return res.status(500).json({ msg: "Error creating user", error: error.message });
    }
    
}


//login user
export const loginUser =   asyncError(  async(req,res,next)=>{
    const{email, password}=req.body;

    if(!email || !password){
        return res.status(400).json({msg:"Please enter valid email and Password"});
    }

    const user = await User.findOne({email:email}).select("+password");

    if(!user){
        return res.status(400).json({msg:"Invalid email or password"});
        
    }

    console.log()
    const isPasswordMatched = await user.comparePassword(password);
    // console.log(isPasswordMatched);

    if(!isPasswordMatched){
        return res.status(400).json({msg:"Invalid Password"});
    }
     
    sendToken(user,200,res);

})

//logout user
export const logout=async(req,res,next)=>{
    res.cookie("token",null,{
        expires:new Date(Date.now()),
        httpOnly:true
    })

    res.status(200).json({
        success:true,
        msg:"Logged out successfully"
    })
}


// forgot password
export const forgotPassword=async(req,res,next)=>{
    const user=await user.findOne({email:req.body.email});

    if(!user){
        return res.status(400).json({msg:"User not found"});
    }

    const resetToken = user.getResetPasswordtoken();

    await user.save({validateBeforsave:false});
    const resetpasswordURL = `${req.protocol}://${req.get("host")}/password/reset/${resetToken}`;
    const message = `your temp password reset token is : \n\n ${resetpasswordURL} \n\n If you have not requested this email then please ignore it.`;

    try{

        await sendEmail({
           email:user.email,
           subject:`Password Recovery`,
           message,
        });
        res.status(200).json({
            success:true,
            message:"email sent",
        })

    }catch(error){
        user.resetpasswordtoken=undefined;
        user.resetPasswordExpire=undefined;
        await user.save({validateBeforeSave:false});
        return next(new ErrorHandler(error.message,500));
        
    }
};

// get user details

export const getuserDetails=async(req,res,next)=>{
    const user=await User.findById(req.user.id);
    res.status(200).json({
        success:true,
        user,
    })
}



// UPdate user profile
export const updateuserProfile = async(req,res,next)=>{
    
    const newUserdata={
        name:req.body.name,
        email:req.body.email,
        bloodgrp:req.body.bloodgrp,
        phone:req.body.phone,
    }

    //(loging user,new data)replace
    const user =await  User.findByIdAndUpdate(req.user.id,newUserdata,{
        new:true,
        runValidators:true,
        useFindAndModify:false
    });

    
   res.status(200).json({
    success:true,
    user
   })
}


// admin find how many users present(get all users).
export const getAllUsers = async(req,res,next)=>{
    const users = await User.find();

    res.status(200).json({
        success:true,
        users
    })
}

// get single user (admin)
export const getsingleUser= async(req,res,next)=>{
    const user = await User.findById(req.params.id);

    if(!user){
        return next(new ErrorHandler(`User does not exist with ID :${req.params.id}`));
    }

    res.status(200).json({
        success:true,
        user
    })
}

//update user role(user or admin)
export const updateUSerRole = async(req,res,next)=>{
    const newuserdata={
        name:req.body.name,
        email:req.body.email,
        role:req.body.role,
    }

    const user = await User.findByIdAndUpdate(req.params.id,newuserdata,{
        new:true,
        runValidators:true,
        useFindAndModify:false
    })

    res.status(200).json({
        success:true,
        user
    })
}


//delete user -- ADMIN
export const deleteUser = async(req,res,next)=>{
   
    const user = await User.findById(req.params.id);
    if (!user) {
        return next(
          new ErrorHandler(`User does not exist with Id: ${req.params.id}`, 400)
        );
      }

      const imageId = user.avatar.public_id;


    await user.deleteOne();


    res.status(200).json({
        success:true,
        message:"user deleted successfully"
    })
}


//update user password
export const updatePassword = async(req,res,next)=>{
    const user = await User.findById(req.user.id).select("+password");

    const ispasswordmatched =await user.comparePassword(req.body.oldPassword);
    if(!ispasswordmatched){
        return next(new ErrorHandler("Old password is incorrect",400));
    }

    if(req.body.newPassword !== req.body.confirmPassword){
        return next(new ErrorHandler("Password don't match",400));
    }

    user.password=req.body.newPassword;
    await user.save();

    sendToken(user,200,res);
}


// delete hospital --Admin
export const deleteHospital= async(req,res,next)=>{
    const hos=await Hospital.findById(req.params.id);
     
    if(!hos){
        return next(new ErrorHandler("Hospital not found"));
       }

       await hos.deleteOne();

    res.status(201).json({
        success:true,
    })
}


// update status - admin
export const updateStatus = async (req, res, next) => {
    try {
        // console.log('hosp cntroller');
        const hos = await Hospital.findById(req.params.id);
        console.log(hos);

        if (!hos) {
            return next(new ErrorHandler("Hospital not found", 404));
        }

        if (hos.hospitalStatus === "Confirmed") {
            return next(new ErrorHandler("This hospital is already confirmed.", 400));
        }

        hos.hospitalStatus = "Confirmed";

        await hos.save({ validateBeforeSave: false });

        res.status(201).json({
            success: true,
            data: hos 
        });
    } catch (error) {
        // Handle errors
        return next(new ErrorHandler("Something went wrong", 500));
    }
}



// get all hospitalss  -admin
export const getAllHospital= async(req,res,next)=>{

    const hospitals=await Hospital.find();
 
    let totalAmount=0;
    hospitals.forEach(order=>{
        totalAmount++;
    })

    res.status(201).json({
        success:true,
        totalAmount,
        hospitals,
    })
}


// get single hospital
export const getSingleHospital= async(req,res,next)=>{

    const hos=await Hospital.findById(req.params.id);
 
    if(!hos){
        return next(new ErrorHandler("Hospital not found",404));
    }

    res.status(201).json({
        success:true,
        hos,
    })
}


export const addDonor =asyncError(async(req,res,next)=>{
        const urlParts =req.url.split('?');
          const queryString = urlParts[1];
          const query =queryString.split('&');
        const id= query[1].split('=')[1];
        const email=query[0].split('=')[1];

          const hospital = await Hospital.findOne({email:email})
          if(!hospital){
           return res.status(400).json(
                {
                    success:false,
                    message:"Error in sending reques"
                }
            )
          }
        let user=  {
            donor:id,
            
            quantity:"5",
            donationDate: new Date().toDateString()
        }
        hospital.donation.push(user);
        await hospital.save();
        res.status(200).json({
            success:true,
            message:"Request raised succefully"
        })

          


})
export const addReceiver =asyncError(async(req,res,next)=>{
    const urlParts =req.url.split('?');
      const queryString = urlParts[1];
      const query =queryString.split('&');
    const id= query[1].split('=')[1];
    const email=query[0].split('=')[1];

      const hospital = await Hospital.findOne({email:email})
      if(!hospital){
       return  res.status(400).json(
            {
                success:false,
                message:"Error in sending reques"
            }
        )
      }
    let user=  {
        receiver:id,
        
        quantity:"5",
        receivingDate: new Date().toDateString()
    }
    hospital.receiving.push(user);
    await hospital.save();
    res.status(200).json({
        success:true,
        message:"Request raised succefully"
    })

      


})
export const getHistory = asyncError(async(req,res,next)=>{
    const urlParts =req.url.split('?')[1];
    const id= urlParts.split('=')[1];
    const history = await Hospital.find({'donation.donor':id}).select("name email address donation")
    // history.donation =history.donation.filter(donor=>donor._id===id)
    log(id)
    for (const i in history){
        history[i].donation=history[i].donation.filter(dr=>dr.donor._id.toString()==id.toString())
        
    }
    res.status(200).json({
        success:true,
        history
    })
})