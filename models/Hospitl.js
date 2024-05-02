import mongoose ,{mongo} from "mongoose";
const schema = new mongoose.Schema({
name:{
    type:String,
    required:true
},
email:{
    type:String,
    required:true,
},
password:{
    type:String,
    required:true,
    
},
licenceNumber:{
    type:String,
    required:true
},
contactNumber:{
    type:Number,
    required:true
},
hospitalStatus:{
    type:String,
    required:true,
    default:"Pending"
},
address:{
    bNo:{
        type:String,
        required:true,
    },
    city:{
        type:String,
        required:true,
    },
    state:{
        type:String,
        required:true,
    },
    country:{
        type:String,
        default:"India",
        required:true,
    },
    pincode:{
        type:Number,
        required:true,
    },
   
},
blood:{
    Ap:{
        type:Number,
        default:20,
        required:true
      },
      An:{
         type:Number,
         default:20,
         required:true
       },
       Bp:{
         type:Number,
         default:20,
         required:true
       },Bn:{
         type:Number,
         default:20,
         required:true
       },
       ABp:{
         type:Number,
         default:20,
         required:true
       },ABn:{
         type:Number,
         default:20,
         required:true
       },
       Op:{
         type:Number,
         default:20,
         required:true
       },
       On:{
         type:Number,
         default:20,
         required:true
       },
},
donation:[{
    donor:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required:true
    },
    
    quantity:{
        type:String,
        required:true
    },
    status:{
        type:String,
        enum:["Donating","Donated"],
        default:"Donating",
    },
    donationDate:{
        type:Date,
        required:true
    }
}],
receiving:[{
    receiver:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required:true
    },
    quantity:{
        type:String,
        required:true
    },
    status:{
        type:String,
        enum:["Receiving","Received"],
        default:"Receiving",
    },
    receivingDate:{
        type:Date,
        required:true
    }
}]

})

export const Hospital = mongoose.model("Hospital",schema)