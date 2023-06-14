const catchAsyncErrors = require("../middelware/catchAsyncErrors");
const Merchant = require("../models/merchant");
const User = require("../models/user");
const Product=require("../models/product")
const ErrorHandler = require("../utils/errorhandler");
const Store=require("../models/store");
const user = require("../models/user");

exports.createMerchant =catchAsyncErrors (async (req, res,next) => {
  
      const {
        firstname,
        lastname,
        hqAddress,
        country,
        state,
        city,
        businessType,
        contactEmail,
        websiteLink,
        phoneNumber, 
        federalTaxNumber,
        experience,
        description,
        storeType,
        logo,
        banner,
        storeLocations,
        facebookLink,
        twitterLink,
        instagramLink,
        linkedinLink,
        youtubeLink,
        yelpLink,
        pinterestLink,bussinessType
      } = req.body;
  const merchantExist=await Merchant.findOne({user:req.user._id})
  if(merchantExist){
    return next(new ErrorHandler("Only One Merhcant Can be Formed with Email ", 500));

  }
      const merchant = await Merchant.create({
        user:req.user._id,
        firstname,
        lastname,
        hqAddress,
        country,
        state,
        city,
        businessType,
        contactEmail,
        websiteLink,
        phoneNumber,
        federalTaxNumber,
        experience,
        description,
        storeType,
        logo,
        banner,
        storeLocations,
        facebookLink,
        twitterLink,
        instagramLink,
        bussinessType,
        linkedinLink,
        youtubeLink,
        yelpLink,
        pinterestLink
      });
  
      res.status(200).json({ message: "Merchant created successfully", merchant });
  
    
  });
  // Merchant Want to See his Account
  exports.getMerchantAccountForMerchant = catchAsyncErrors( async (req, res,next) => {

      const merchantAccount =await Merchant.findOne({user:req.user._id})
      if(!merchantAccount){

        return next(new ErrorHandler("Merchant Not Found ", 500));
    }
      const merchant = await Merchant.findById(merchantAccount._id);
      
      res.status(200).json({ merchant });
  });
  

// Customer want To see Merchant Account  
exports.getMerchantForUser = catchAsyncErrors(async (req, res, next) => {
  const id=req.params.merchantId
  
  const merchantAccount = await Merchant.findOne({_id:id}).select("-amount");
  if (!merchantAccount) {
    return next(new ErrorHandler("Merchant Not Found", 500));
  }

  res.status(200).json({ merchantAccount });
});

  exports.updateMerchant = catchAsyncErrors( async (req, res,next) => {
    
      const merchantAccount =await Merchant.findOne({user:req.user._id})
      if (!merchantAccount) {
        return next(new ErrorHandler("Merchant Not Found", 500));

      }
      const updateData = req.body;
      const merchant = await Merchant.findByIdAndUpdate(merchantAccount._id, updateData, { new: true,runValidators:false });
      
      res.status(200).json({ message: "Merchant updated successfully", merchant });
    
    
  });
  
  //{Delete Merchant  By Merchant  }
  exports.deleteMerchant = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user._id);
  
    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }
  
    const merchant = await Merchant.findOne({ user: req.user._id });
  
    if (!merchant) {
      return next(new ErrorHandler("Merchant not found", 404));
    }
  
    if (!req.body.password) {
      return next(new ErrorHandler("Please enter your password", 400));
    }
  
    const isPasswordMatched = await user.comparePassword(
      req.body.password,
      next
    );
  
    if (!isPasswordMatched) {
      return next(new ErrorHandler("Invalid password", 401));
    }
  const products=await Product.find({merchant:merchant._id})
  if(products){
    await Product.deleteMany({merchant:merchant._id})
  }
    const store = await Store.findOne({ owner: merchant._id });
  
    if (store) {
      await Store.findByIdAndDelete(store._id);
    }
  
    await Merchant.findByIdAndDelete(merchant._id);
  
    res.status(200).json({ message: "Merchant deleted successfully" });
  });
  


 