import  ErrorHandler from "../utils/errorhandler.js"
import  jwt from "jsonwebtoken";
import  {User} from "../models/userModel.js";
import  { asyncError } from  "./errorMiddleware.js"

export const isAuthenticatedUser=async(req,res,next)=>{
    const {token}=req.cookies;

    if(!token){
        return next(new ErrorHandler("please login to access this resource",401));
    }
    const decodedData=jwt.verify(token,process.env.JWT_SECRET);


    req.user=await User.findById(decodedData.id);
    next();
}
export const isAuthenticated = asyncError((req,res,next)=>{
 
    if(req.cookies.isLoggedin){
        
          const isVerified = jwt.verify(req.cookies.isLoggedin,process.env.JWT_SECRET)
    
          if(isVerified){
    next();
          }else{
             return next(new ErrorHandler("Account not verified", 403))
          }
    }else{
     return next(new ErrorHandler("Not logged in",401));
    }
 })

export const authorizeRoles = (...roles)=>{
    //check karega ia array me admin h ki nhi
    return (req,res,next)=>{
        //req.user.role se db se role aaiga ki kya wo admin h(kyuki hamne func me role admin pass kiya h).agar wo user h to if condition execute hogi varna next.
        if(!roles.includes(req.user.role)){
          return next(new ErrorHandler(`Role: ${req.user.role} is not allowed to access this resource`,403));
        }
        next();
    };
};