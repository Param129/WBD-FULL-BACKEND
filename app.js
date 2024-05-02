import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import fileupload from 'express-fileupload';
import dotenv from 'dotenv';
import  cors from "cors"
import {loggerMiddleware} from "./middleware/logger.js"
dotenv.config({
  path: "./config/config.env",
});
const uri= process.env.MONGO_URL
console.log(uri);
const app=express();
// Builtin middleware
app.use(express.json({limit:'50mb'}));
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended:true}));
app.use(fileupload());

// // all routes
import  user from "./routes/userRoutes.js"
import  donate from "./routes/donationRoutes.js"
import  hospitalroutes from "./routes/hospitalRoutes.js"
import { errorMiddleware } from './middleware/errorMiddleware.js';
//Third party middleware
app.use(cors({
  credentials:true,
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE","PATCH"]
 
}))
  //Router MIddleware
  app.use(loggerMiddleware);
app.use("/blood/v1",user);
app.use("/blood/v1",donate)
app.use('/blood/v1',hospitalroutes)


app.use(errorMiddleware)

export default app;