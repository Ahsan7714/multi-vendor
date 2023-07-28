const mongoose = require("mongoose");
const cron = require('node-cron');
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
  isTopSeller:{
    type:Boolean,
    default:false
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

const Merchant=  mongoose.model("Merchant", merchantSchema);
  module.exports =Merchant

  async function calculateTotalSales(month, year) {
    try {
      const salesAggregate = await Merchant.aggregate([
        {
          $match: {
            createdAt: {
              $gte: new Date(year, month - 1, 1),
              $lt: new Date(year, month, 1)
            }
          }
        },
        {
          $group: {
            _id: null,
            totalSales: {
              $sum: { $toInt: '$amount' }
            },
            topSeller: {
              $sum: {
                $cond: [{ $gt: [{ $toInt: '$amount' }, 1000] }, 1, 0]
              }
            }
          }
        }
      ]);
  
      if (salesAggregate.length > 0) {
        return {
          totalSales: salesAggregate[0].totalSales,
          isTopSeller: salesAggregate[0].topSeller > 0
        };
      } else {
        return {
          totalSales: 0,
          isTopSeller: false
        };
      }
    } catch (error) {
      console.error('Error calculating total sales:', error);
      throw error;
    }
  }
  
  // Update the top seller status for all merchants
  async function updateTopSellerStatus() {
    try {
      const { isTopSeller } = await calculateTotalSales(new Date().getMonth() + 1, new Date().getFullYear());
  
      const merchants = await Merchant.find();
      for (const merchant of merchants) {
        merchant.isTopSeller = isTopSeller;
        await merchant.save();
      }
  
      console.log('Top seller status updated successfully');
    } catch (error) {
      console.error('Error updating top seller status:', error);
      throw error;
    }
  }
  
  // Schedule the updateTopSellerStatus function to run daily at 12:00 AM
  cron.schedule('0 0 * * *', () => {
    updateTopSellerStatus();
  });
  