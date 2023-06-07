const Product = require("../models/product");
const Merchant=require("../models/merchant")
const catchAsyncErrors=require("../middelware/catchAsyncErrors")
const Store=require("../models/store")
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
    store:req.params.storeId,
    offer,
  });

  await product.save();
  const store = await Store.findByIdAndUpdate(
    req.params.storeId,
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

  const product = await Product.findByIdAndDelete(productId);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }

  res.status(200).json({
    success: true,
    message: "Product deleted successfully",
  });
});
