import app from "./app.js";
import cloudinary from 'cloudinary';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import {connectDB} from "./config/database.js"
dotenv.config();


          // DATABASE cONNECTION
const uri= process.env.MONGO_URL
const port= process.env.PORT
connectDB();



cloudinary.config({
  cloud_name:process.env.CLOUDINARY_NAME,
  api_key:process.env.CLOUDINARY_API_KEY,
  api_secret:process.env.CLOUDINARY_API_SECRET,
})

app.get('/',(req,res)=>{
  res.send("<h1>Working1</h1>")
})
                 //LISTINENING
const server = app.listen(port,()=>{
    console.log(`server is working on localhost:${port}`)
})