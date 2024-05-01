
import mongoose from 'mongoose';
import {User} from './userModel.js';
import {Hospital} from './Hospitl.js'

const donationSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:User,
        required:true,
    },
    hospitalId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:Hospital,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    donatedAt:{
        type:Date,
        required:true,
    },
    bloodGroup: { type: String, required: true },
    units: { type: Number, required: true },
    date: { type: String, required: true },
    disease: { type: String },
    status: { type: String, required: true, 
              enum: ['Pending', 'Approved', 'Denied', 'Donated'], 
              default: 'Pending' 
            },
})

export const Donation = mongoose.model("Donation",donationSchema);