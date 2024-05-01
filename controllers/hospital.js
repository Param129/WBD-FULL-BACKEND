
import { asyncError } from "../middleware/errorMiddleware.js";
import {Hospital} from "../models/Hospitl.js"
import jwt from "jsonwebtoken";
import ErrorHandler from "../utils/errorhandler.js";
import { log } from "debug/src/browser.js";
import { User } from "../models/userModel.js";

export const hospitalSignup = asyncError( async (req,res,next)=>{
    const {
        name,
        licenceNumber,
        contactNumber,
        email,
        password,
        address,
        donation,
        receiving

    } =req.body
    const hospitalInfo={
        name,
        licenceNumber,
        contactNumber,
        email,
        password,
        address,
        donation,
        receiving
    }
    const hospital = await  Hospital.findOne({email});
       if(hospital){
        console.log(hospital);
        res.status(409).json({
            success:false,
            message:'User already exist'
        })
       }
       else{
    await Hospital.create(hospitalInfo);
    res.status(201).json({
        success:true,
        message:"Hospital signed in succefully "
     })
     
}})

export const hospitalLogin =  asyncError(async (req,res,next)=>{

   let Email =req.body.email;
   let Password=req.body.password
    const hospital= await Hospital.findOne({email:Email});
    if(hospital){
        
     if(Password===hospital.password){
    let uid= hospital._id;
       const token =jwt.sign({payload:uid},"paramveersinghchoudhary00")
      //  console.log(token);
       res.cookie('isLoggedin',token)
        res.status(200).json({
            success:true,
            hospital
        })
     
     }else{
        res.status(401).json({
            success:false,
            message:'Enter correct password',
        })
     }
    }else{
        res.status(401).json({
            success:false,
            message:'Invalid credential'
        })
    }
})

export const logout = async (req,res,next)=>{
  const payload= jwt.decode(req.cookies.isLoggedin,process.env.JWT_KEY).payload;

    res.clearCookie('isLoggedin',{httpOnly:true,secure:true})
    .status(200)
    .json({
        success:true,
        message:"Loggedout"
    })
}

export const hospitalSearch= asyncError(async(req,res,next)=>{
const city= req.body.city;
const state=req.body.state

     const hospitals = await Hospital.find({ $or: [{ 'address.city': city }, { 'address.state': state }] });
if(hospitals){

// hospitals=hospitals.filter((hospital,bg)=>hospital.blood>0);
res.status(200).json({
  hospitals
})
}else{
 req.status(200).json({
  hospitals:[]
 })
}



})

//  redis Upgradation
export const getDonor = asyncError(async (req,res,next)=>{
      
           const payload= jwt.decode(req.cookies.isLoggedin,process.env.JWT_KEY).payload;
          //  const cache  = await redisClient.get(`donor:${payload}`);
          //  if(cache){
          //   let donor = JSON.parse(cache);
          //   return res.status(200).json({
          //     success:true,
          //     donor
          //   })
          //  }
        const hospital = await Hospital.findById(payload);
      
          if(hospital){
            for(const dnr of hospital.donation){
             await User.populate(dnr,{path:'donor',select:"name age bloodgrp phone"})
          
            }
     
           
            res.status(200).json({
                success:true,
              donor: hospital.donation

            })

          }else{
            return  next(new ErrorHandler("Invalid Hospital Id",401));
          }

})
export const getReceiver = asyncError(async (req,res,next)=>{
  const payload= jwt.decode(req.cookies.isLoggedin,process.env.JWT_KEY).payload;
  const hospital = await Hospital.findById(payload);

    if(hospital){
      for(const dnr of hospital.receiving){
       await User.populate(dnr,{path:'receiver',select:"name age bloodgrp phone"})
    
      }
     
      res.status(200).json({
          success:true,
        receiver: hospital.receiving

      })

    }else{
      return  next(new ErrorHandler("Invalid Hospital Id",401));
    }


})

export const toggleStatus = asyncError(async (req,res,next)=>{
    const payload =jwt.decode(req.cookies.isLoggedin,process.env.JWT_KEY).payload;
    const hospital = await  Hospital.findById(payload);

    if(hospital){
      const userID= req.params.Id;
       console.log(userID);
   let donorindex=-1;
    for (let index = 0; index < hospital.donation.length; index++) {

              if(hospital.donation[index].donor.toString()=== userID.toString()&&hospital.donation[index].status!='Donated'){
                donorindex=index;
                break;
              }
        
    }
    
  //  console.log(donorindex);
      const update={
        $set:{
            [`donation.${donorindex}.status`]: 'Donated' //[] this is use to create dynamic field name since we are using donorindex
        }
      }
     
     const updateResponse = await Hospital.updateOne({_id:payload},update)
     console.log(updateResponse);
     res.json({
        updateResponse
     })
     
    }else{
        return next( new ErrorHandler("Invalid hospital id",401));
    }
}) 


export const toggleStatusReceiving = asyncError(async (req,res,next)=>{
  const payload =jwt.decode(req.cookies.isLoggedin,process.env.JWT_KEY).payload;
  const hospital = await  Hospital.findById(payload);

  if(hospital){
    const userID= req.params.Id;
     console.log(userID);
 let donorindex=-1;
  for (let index = 0; index < hospital.receiving.length; index++) {
      // console.log(hospital.donation[index].donor._id,userID);
            if(hospital.receiving[index].receiver.toString()=== userID.toString()&&hospital.receiving[index].status!='Received'){
              donorindex=index;
              break;
            }
      
  }
  
//  console.log(donorindex);
    const update={
      $set:{
          [`receiving.${donorindex}.status`]: 'Received' //[] this is use to create dynamic field name since we are using donorindex
      }
    }
   
   const updateResponse = await Hospital.updateOne({_id:payload},update)
   console.log(updateResponse);
   res.json({
      updateResponse
   })
   
  }else{
      return next( new ErrorHandler("Invalid hospital id",401));
  }
}) 


export const increaseBlood =asyncError(async (req,res,next)=>{
      // console.log(req.cookies.isLoggedin)
      console.log("edh")
    const payload =jwt.decode(req.cookies.isLoggedin,process.env.JWT_KEY).payload;
     const hospital =  await Hospital.findById(payload)
     if(hospital){
        const group =req.params.bloodgroup;
    const quantity =req.params.quantity;
              let initialblood= hospital.blood[group];
              let updatedblood=initialblood+ parseInt(quantity);
           const update=  { $set:{
                     [`blood.${group}`]:updatedblood
              }}
              console.log(update);
        const IncreaseBlood = await Hospital.findByIdAndUpdate (payload,update) 
        res.json({
            IncreaseBlood
        })
             
     }else{
        return next( new ErrorHandler("Invalid hospital id",401))
     }
   
})

export const decreaseBlood =asyncError(async (req,res,next)=>{
    console.log('decrease called');
    const payload =jwt.decode(req.cookies.isLoggedin,process.env.JWT_KEY).payload;
     const hospital =  await Hospital.findById(payload)
     if(hospital){
        const group =req.params.bloodgroup;
    const quantity =req.params.quantity;
              let initialblood= hospital.blood[group];
              let updatedblood=initialblood-parseInt(quantity);
              if(updatedblood<0){
                res.status(401).json({
                    success:false,
                    message:"Not sufficient blood"
                })
              }
           const update=  { $set:{
                     [`blood.${group}`]:updatedblood
              }}
              console.log(update);
        const DecreaseBlood = await Hospital.findByIdAndUpdate (payload,update) 
        res.json({
            DecreaseBlood
        })
             
     }else{
        return next( new ErrorHandler("Invalid hospital id",401))
     }
   
})

export const getHospital=async (req,res,next)=>{
  const data=  await Hospital.find();
  res.json({
    data
  })
}