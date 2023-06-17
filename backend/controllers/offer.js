const Offer = require('../models/offer');
const catchAsyncErrors=require("../middelware/catchAsyncErrors")
const ErrorHandler = require('../utils/errorHandler');
const Product=require("../models/product")
const Merchant=require("../models/merchant")
const Store=require("../models/store")


// Create a new offer
exports.createOffer = catchAsyncErrors(async (req, res, next) => {
    const { offerTitle, productCategory, maxVisits, price, cashback, status, startDate, endDate } = req.body;
    const productId = req.params.id;
    
  
    const product = await Product.findById(productId);
    if (!product) {
      return next(new ErrorHandler('Product not found', 404));
    }
  
    if (!req.store.products.includes(product._id)) {
      return next(new ErrorHandler('Merchant does not own the product', 403));
    }
  
    const offer = await Offer.create({
      merchant:req.store.owner,
      store: req.store._id,
      product: product._id,
      offerTitle,
      productCategory,
      maxVisits,
      price,
      cashback,
      status,
      startDate,
      endDate,
    });
    product.offer.push(offer._id);
  await product.save();
    res.status(201).json({
      success: true,
      offer,
    });
  });
  
// Get all offers of a merchant {Merchnat}
exports.getAllOffers = catchAsyncErrors(async (req, res, next) => {
    const merchantId = req.user._id;
    const merchant=await Merchant.findOne({user:merchantId})
    const store=await Store.findOne({owner:merchant._id})
    const offers = await Offer.find({store:store._id,merchant:merchant._id});

  res.status(200).json({
    success: true,
    count: offers.length,
    offers,
  });
});
// Get All  offers of a store {customer}
exports.getAllOffersOfStore = catchAsyncErrors(async (req, res, next) => {
    
    
    const offers = await Offer.find({store:req.params.id});

  res.status(200).json({
    success: true,
    count: offers.length,
    offers,
  });
});

// Get a single offer by ID
exports.getOfferById = catchAsyncErrors(async (req, res, next) => {
  const offer = await Offer.findById(req.params.id);

  if (!offer) {
    return next(new ErrorHandler('Offer not found', 404));
  }

  res.status(200).json({
    success: true,
    offer,
  });
});

// Update an offer by ID
exports.updateOffer = catchAsyncErrors(async (req, res, next) => {
  let offer = await Offer.findById(req.params.id);

  if (!offer) {
    return next(new ErrorHandler('Offer not found', 404));
  }

  offer = await Offer.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    offer,
  });
});

// Delete an offer by ID
exports.deleteOffer = catchAsyncErrors(async (req, res, next) => {
  const offer = await Offer.findById(req.params.id);

  if (!offer) {
    return next(new ErrorHandler('Offer not found', 404));
  }

  await offer.remove();

  res.status(200).json({
    success: true,
    message: 'Offer deleted successfully',
  });
});
