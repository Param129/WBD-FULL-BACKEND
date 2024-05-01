import mongoose from 'mongoose';
import {User} from './userModel.js';
import {Hospital} from './hospitalmodel.js';

const receiverSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    bankId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital', required: true },
    name: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, required: true },
    bloodGroup: { type: String, required: true },
    units: { type: Number, required: true },
    date: { type: String, required: true },
    reason: { type: String },
    status: { type: String, 
              enum: ['Pending', 'Approved', 'Denied', 'Completed'], 
              default: 'Pending'
             }
});

export const Receiver= mongoose.model("Receiver",receiverSchema);