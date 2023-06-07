const Store = require("../models/store");
const catchAsyncErrors = require("../middelware/catchAsyncErrors");
const ErrorHandler = require("../utils/errorHandler");
const User=require("../models/user")
const Merchant=require("../models/merchant")
const cloudinary=require("cloudinary")
// Create a new store
exports.createStore = catchAsyncErrors(async (req, res, next) => {
  const { storeName, storeType, logo, banner, storeLocations } = req.body;
  
 const merchant=await Merchant.findOne({user:req.user._id})
 if(!merchant){
    return next(new ErrorHandler("Merchant Not Found", 404));

 }
//  const cloudlogo=await cloudinary.v2.uploader(logo, {
//     folder: "logos",
//     width: 150,
//     crop: "scale",
//   }) 
//   const cloudbanner=await cloudinary.v2.uploader(banner, {
//     folder: "banners",
//     width: 150,
//     crop: "scale",
//   }) 
  const store = new Store({
    storeName,
    storeType,
    logo,
    banner,
    storeLocations,
    owner:merchant._id,
  });

  await store.save();

  res.status(201).json({
    success: true,
    store,
  });
});

// Get a single store
exports.getStore = catchAsyncErrors(async (req, res, next) => {
  const storeId = req.params.id;

  const store = await Store.findById(storeId).populate("owner", "firstname lastname");

  if (!store) {
    return next(new ErrorHandler("Store not found", 404));
  }

  res.status(200).json({
    success: true,
    store,
  });
});

// Update a store
exports.updateStore = catchAsyncErrors(async (req, res, next) => {
  const storeId = req.params.id;
  const { storeName, storeType, logo, banner, storeLocations } = req.body;

  let store = await Store.findById(storeId);

  if (!store) {
    return next(new ErrorHandler("Store not found", 404));
  }
  let newStoreData={
    storeName,
    storeType,
    storeLocations
  }
if(req.body.logo !==""){
await cloudinary.v2.uploader.destroy(store.logo.public_id)
const cloudlogo=await cloudinary.v2.uploader(logo, {
    folder: "logos",
    width: 150,
    crop: "scale",
  }) 
  newStoreData.logo={
    public_id:cloudlogo.public_id,
    url:cloudlogo.url
  }
}

if(req.body.banner !==""){
    await cloudinary.v2.uploader.destroy(store.logo.public_id)
    const cloudbanner=await cloudinary.v2.uploader(logo, {
        folder: "banners",
        width: 150,
        crop: "scale",
      }) 
      newStoreData.banner={
        public_id:cloudbanner.public_id,
        url:cloudbanner.url
      }
    }

     await Store.findByIdAndUpdate(storeId, newStoreData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      });
      await store.save()
  res.status(200).json({
    success: true,
    store,
  });
});

// Delete a store
exports.deleteStore = catchAsyncErrors(async (req, res, next) => {
  const storeId = req.params.id;

  let store = await Store.findById(storeId);

  if (!store) {
    return next(new ErrorHandler("Store not found", 404));
  }  
  const user=await User.findById(req.user._id)
  

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




  await store.remove();

  res.status(200).json({
    success: true,
    message: "Store deleted successfully",
  });
});


