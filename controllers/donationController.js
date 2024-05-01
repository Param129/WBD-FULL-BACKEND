import {Donation} from '../models/donationmodel.js';
import ErrorHandler from '../utils/errorhandler.js';
// import {Hospital} from '../models/hospitalmodel.js';
// import {User} from '../models/userModel.js';


export const donate = async(req,res,next)=>{
    const {email,bloodgrp,units,disease}=req.body;
    const newDonation = await Donation.create({
        user:req.user._id,
        email,
        bloodgrp,
        units,
        disease,
        donatedAt:Date.now()
    });

    res.status(201).json({
        success:true,
        newDonation,
    })
}