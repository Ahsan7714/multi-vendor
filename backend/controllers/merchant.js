const catchAsyncErrors = require("../middelware/catchAsyncErrors");
const Merchant = require("../models/merchant");
const User = require("../models/user");
const ErrorHandler = require("../utils/errorhandler");
const Store=require("../models/store")
exports.createMerchant =catchAsyncErrors (async (req, res) => {
  
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
  
  exports.getMerchant = async (req, res,next) => {
    try {
      const merchantAccount =await Merchant.findOne({user:req.user._id})
      if(!merchantAccount){

        return next(new ErrorHandler("Merchant Not Found ", 500));
    }
      const merchant = await Merchant.findById(merchantAccount._id);
      
      res.status(200).json({ merchant });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  

  
  
  exports.updateMerchant = async (req, res,next) => {
    try {
      const merchantAccount =await Merchant.findOne({user:req.user._id})
      if (!merchantAccount) {
        return next(new ErrorHandler("Merchant Not Found", 500));

      }
      const updateData = req.body;
      const merchant = await Merchant.findByIdAndUpdate(merchantAccount._id, updateData, { new: true,runValidators:false });
      
      res.status(200).json({ message: "Merchant updated successfully", merchant });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  //{Delete Merchant  By User }
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
  
    const store = await Store.findOne({ owner: merchant._id });
  
    if (store) {
      await Store.findByIdAndDelete(store._id);
    }
  
    await Merchant.findByIdAndDelete(merchant._id);
  
    res.status(200).json({ message: "Merchant deleted successfully" });
  });
  


 