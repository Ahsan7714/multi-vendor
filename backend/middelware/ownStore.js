// Middleware to check if the authenticated user is the owner of the store
const Merchant = require("../models/merchant");
const ErrorHandler = require("../utils/errorhandler");
const Store = require("../models/store");
const catchAsyncErrors = require("./catchAsyncErrors");

exports.checkOwnStore = catchAsyncErrors(async (req, res, next) => {
  const merchantId = req.user._id;
  const merchant = await Merchant.findOne({ user: merchantId });
  if (!merchant) {
    return next(new ErrorHandler('Access Denied. Merchant does not exist.', 403));
  }
  
  if (merchant.user.toString() !== merchantId.toString()) {
    return next(new ErrorHandler('Access Denied. Invalid merchant.', 403));
  }
  const store = await Store.findOne({ owner: merchant._id.toString() });
  if (!store) {
    return next(new ErrorHandler('Access denied. this store not belongs to you .', 403));
  }
  
  if (store.owner.toString() !== merchant._id.toString()) {
    return next(new ErrorHandler('Access denied.', 403));
  }
  
  req.store = store;
  next();
});
