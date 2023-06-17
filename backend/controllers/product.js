const Product = require("../models/product");
const Merchant=require("../models/merchant")
const catchAsyncErrors=require("../middelware/catchAsyncErrors")
const Store=require("../models/store");
const ApiFeatures = require("../utils/apifeatures");
const ErrorHandler = require("../utils/errorHandler");

// Get All products
exports.getAllProducts = catchAsyncErrors(async (req, res, nest) => {
    const resultPerPage = 8;
  
    const apiFeature = new ApiFeatures(Product.find(), req.query)
      .search()
      .filter()
      .pagination(resultPerPage);
  
    let products = await apiFeature.query;
  
    const productsCount = await Product.countDocuments();
    const filteredProductsCount = products.length;
  
    res.status(200).json({
      success: true,
      products,
      productsCount,
      resultPerPage,
      filteredProductsCount,
    });
  });
  
  
// Get All products of a Store 
exports.getAllProductsOfStore=catchAsyncErrors(async(req,res,next)=>{

    const products=await Product.find({store:req.params.storeId})

    res.status(200).json({success:true,products})

})
// Create a new product
exports.createProduct = catchAsyncErrors(async (req, res,next) => {
    let  merchant=await Merchant.findOne({user:req.user._id})
 if(!merchant){
    return next(new ErrorHandler("Merchant Not Found", 404));

 }
  const {
    productName,
    description,
    price,
    category,
    stock,
    totalRating,
    ratings,
    images,
    numOfReviews,
    offer,
  } = req.body;

  const product = new Product({
    productName,
    description,
    price,
    category,
    stock,
    totalRating,
    ratings,
    images,
    numOfReviews,
    merchant:merchant._id,
    store:req.store._id,
    offer,
  });

  await product.save();
  const store = await Store.findByIdAndUpdate(
    req.store._id,
    { $push: { products: product._id } },
    { new: true }
  );
  
  res.status(201).json({
    success: true,
    product,
  });
});

// Get a single product
exports.getProduct = catchAsyncErrors(async (req, res) => {
  const productId = req.params.id;

  const product = await Product.findById(productId);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }

  res.status(200).json({
    success: true,
    product,
  });
});

// Update a product
exports.updateProduct = catchAsyncErrors(async (req, res) => {
  const productId = req.params.id;
  const updateData = req.body;

  const product = await Product.findByIdAndUpdate(productId, updateData, {
    new: true,
    runValidators: true,
  });

  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }

  res.status(200).json({
    success: true,
    product,
  });
});

// Delete a product
exports.deleteProduct = catchAsyncErrors(async (req, res) => {
    const productId = req.params.id;
  
    const product = await Product.findById(productId);
  
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
  
    // Delete the product ID from the associated store
    const storeId = product.store;
    await Store.findByIdAndUpdate(req.store._id, { $pull: { products: productId } });
  
    // Delete the product
    await Product.findByIdAndDelete(productId);
  
    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  });
  
  // post review 
 exports.postReview=catchAsyncErrors(async(req,res,next)=>{
  const id=req.params.id  
  const {rating,comment}=req.body
  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };
  const product = await Product.findById(id);
  if(!product){
    return next(new ErrorHandler("Product Not Found", 404));

  }
  const isReviewed = product.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString()
  );
  if(isReviewed){
    product.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user._id.toString())
        (rev.rating = rating), (rev.comment = comment);
    });
  }else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }
  let avg = 0;

  product.reviews.forEach((rev) => {
    avg += rev.rating;
  });

  product.totalRating = avg / product.reviews.length;

  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
  });
})


 // delete Review
 exports.deleteReview = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  const reviews = product.reviews.filter(
    (rev) => rev._id.toString() !== req.query.id.toString()
  );

  let avg = 0;

  reviews.forEach((rev) => {
    avg += rev.rating;
  });

  let ratings = 0;

  if (reviews.length === 0) {
    ratings = 0;
  } else {
    ratings = avg / reviews.length;
  }

  const numOfReviews = reviews.length;

  await Product.findByIdAndUpdate(
    req.query.productId,
    {
      reviews,
      ratings,
      numOfReviews,
    },
    {
      new: true,
      runValidators: true, // Set to true to apply schema validators
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
  });
});

exports.getProductReviews = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});


// delete own review
exports.deleteOwnReview = catchAsyncErrors(async (req, res, next) => {
  const productId = req.params.productId;
  const reviewId = req.params.reviewId;

  const product = await Product.findById(productId);
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  const review = product.reviews.find((rev) => rev._id.toString() === reviewId.toString());
  if (!review) {
    return next(new ErrorHandler("Review not found", 404));
  }

  // Check if the review belongs to the authenticated user
  if (review.user.toString() !== req.user._id.toString()) {
    return next(new ErrorHandler("Unauthorized. You cannot delete this review", 401));
  }

  // Remove the review from the product's reviews array
  product.reviews = product.reviews.filter((rev) => rev._id.toString() !== reviewId.toString());

  // Recalculate the average rating
  let avg = 0;
  product.reviews.forEach((rev) => {
    avg += rev.rating;
  });
  product.ratings = product.reviews.length > 0 ? avg / product.reviews.length : 0;
  product.numOfReviews = product.reviews.length;

  // Save the updated product
  await product.save();

  res.status(200).json({
    success: true,
  });
});
