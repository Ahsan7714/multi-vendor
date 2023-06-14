const express=require("express")
const { isAuthenticatedUser, authorizeRoles } = require("../middelware/auth")
const { createProduct, getProduct, updateProduct, deleteProduct,getAllProducts,getAllProductsOfStore,postReview,deleteReview, getProductReviews, deleteOwnReview } = require("../controllers/product")
const { checkOwnStore } = require("../middelware/ownStore")
const router=express.Router()
// all products of site
router.route("/products").get(getAllProducts)
// all products of a store
router.route("/products/:storeId").get(getAllProductsOfStore)
// create a product {merchant}
router.route("/product/create").post(isAuthenticatedUser,authorizeRoles("merchant"),checkOwnStore,createProduct)
// get a single product
router.route("/product/:id").get(getProduct)
router.route("/product/:id").put(isAuthenticatedUser,authorizeRoles("merchant"),checkOwnStore,updateProduct).delete(isAuthenticatedUser,authorizeRoles("merchant"),checkOwnStore,deleteProduct)
// post a review on a product
router.route("/product/review/:id").put(isAuthenticatedUser,postReview)
// delete review on product
router.route("/product/review/delete").delete(isAuthenticatedUser, authorizeRoles("merchant"), checkOwnStore, deleteReview);
// get produt review
router.route("/product/reviews/:id").get(getProductReviews);
// delete its own review 
router.route("/product/review/:productId/:reviewId").delete(isAuthenticatedUser, deleteOwnReview);


module.exports=router   