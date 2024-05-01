import  mongoose from "mongoose";
import  validator from "validator";
import  bcrypt from "bcryptjs";
import  jwt from "jsonwebtoken";
import  crypto from "crypto";

// const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];


const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please enter your email"],
        maxLength:[40,"Name cannot exceed maclength"],
        minLength:[3,"Name should have more then 5 characters"]
    },

    age: { type: Number, required: true },
    gender: { type: String, required: true },

    email:{
        type:String,
        required:[true,"Please enter your email"],
        unique:true,
    },

    phone: { type: Number, unique: true, required: true },

    password:{
        type:String,
        required:[true,"Please enter your password"],
        minLength:[4,"Password should have more then 4 characters"],
        select:false
    },

    avatar:
    {
        public_id:{
            type:String,
            default:"https://picsum.photos/id/237/200/300"
        },
        url:{
            type:String,
            default:"https://picsum.photos/id/237/200/300"
        }
    },

    bloodgrp: { type: String, required: true },
    address: { type: String },

  
    role:{
        type:String,
        default:"user"
    },

    createdAt:{
        type:Date,
        default:Date.now(),
    },


    resetpasswordtoken:String,

    resetPasswordExpire:Date,
});



// converting password to hash before saving it to database
userSchema.pre("save",async function(next){
    if(!this.isModified("password")){
        next();
    }
    this.password=await bcrypt.hash(this.password,10);
});


// generating JWT token
userSchema.methods.getJWTToken=function(){
    return jwt.sign({id:this._id},"paramveersinghchoudhary00",{
        expiresIn:50000000000,
    })
}

//compare Password
userSchema.methods.comparePassword = async function(enteredpassword){
    return await bcrypt.compare(enteredpassword,this.password)//compare entered and hashed password.
}


// Generating Password Reset Token
userSchema.methods.getResetPasswordToken =async function () {
    // Generating Token
    const resetToken = crypto.randomBytes(20).toString("hex");
  
    // Hashing and adding resetPasswordToken to userSchema
    this.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
  
    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
  
    return resetToken;
  };


export const User= mongoose.model("User",userSchema);