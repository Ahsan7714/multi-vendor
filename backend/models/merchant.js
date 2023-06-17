const mongoose = require("mongoose");

const merchantSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  
  firstname:{
    type:String,
    required:true
  },
  lastname:{
    type:String,
    required:true
  },
  amount:{
    type:String,
    default:0,
    required:true

  },
  rating:{
    type:Number,
    default:0,
    required:true
  },
  hqAddress:{
    type:String,
    required:true
  },
  
  country:{
    type:String,
    required:true
  },
  state:{
    type:String,
    required:true
  },
  city:{
    type:String,
    required:true
  },
  bussinessType:{
    type:String,
    required:true
  },
  contactEmail:{
    type:String,
    required:true
  },
  websiteLink:{
    type:String,
    required:true
  },
  phoneNumber:{
    type:String,
    required:true
  },
  federalTaxNumber:{
    type:String,
    required:true
  },
  experience: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  
      facebookLink:{
        type:String
      },
      twitterLink:{
        type:String
      },
      instagramLink:{
        type:String
      },
      linkedinLink:{
        type:String
      },
      youtubeLink:{
        type:String
      },
      yelpLink:{
        type:String
      },
      pintrestLink:{
        type:String
      }

});

module.exports=mongoose.model("Merchant", merchantSchema);
  
