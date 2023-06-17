const catchAsyncErrors = require("../middelware/catchAsyncErrors");
const Merchant = require("../models/merchant");
const User = require("../models/user");
const Product=require("../models/product")
const ErrorHandler = require("../utils/errorhandler");
const Store=require("../models/store");
const user = require("../models/user");
const sendEmail = require("../utils/sendEmail");

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
  


  // withdraw payment 
exports.requestPaymentWithdraw=catchAsyncErrors(async(req,res,next)=>{
   const merchantId=req.store.owner
   const amount=req.body.amount
   if(!amount || amount==0){
    return next(new ErrorHandler("Minimum Price Should Be More Than 0$", 401));
   }

   const paymentWithdrawUrl = `${req.protocol}://${req.get(
    "host"
  )}/merchant/widthdraw/`;

  const message = `
  <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          margin: 0;
          padding: 20px;
        }
        h1 {
          color: #333;
          font-size: 24px;
          margin-bottom: 20px;
        }
        p {
          color: #555;
          font-size: 16px;
          line-height: 1.5;
          margin-bottom: 10px;
        }
        .button {
          display: inline-block;
          background-color: #3498db;
          color: #ffff;
          text-decoration: none;
          padding: 10px 20px;
          border-radius: 4px;
          margin-top: 20px;
        }
      </style>
    </head>
    <body>
      <h1>Payment Withdraw </h1>
      <p>Hello,</p>
      <p>
        We received a request to Withdraw your Payment. To proceed with the
        payment  withdraw, please use the following Link:
      </p>
      <p>
        If you did not request , please disregard this email.
        Your account is still secure.
      </p>
      <p>
        Click the button below to reset your password. This token will expire
        after 24 hours.
      </p>
      <a href="${paymentWithdrawUrl}" class="button">Withdraw Your Payment </a>
      <p>
        If you have any questions or need further assistance, please contact
        our support team.
      </p>
      <p>Best regards,</p>
      <p>The Support Team</p>
    </body>
  </html>
`;


  try {
    await sendEmail({
      email: user.email,
      subject: `Multi Vendor Payment Withdraw`,
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${req.user.email} successfully`,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
    
}) 