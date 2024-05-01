import mongoose from "mongoose";


const DB_NAME = "BloodBank"

export const connectDB = async ()=>{
   try {
    const connection =await mongoose.connect(`${process.env.MONGO_URL}/${DB_NAME}`)
    console.log(`Data base is connected with ${connection.connection.host}`);
   } catch (error) {
    console.log("Error connecting to database ",error.message);
   }
}