const express=require("express")
const { isAuthenticatedUser, authorizeRoles } = require("../middelware/auth")
const { createProduct, getProduct } = require("../controllers/product")
const router=express.Router()


router.route("/create/:storeId").post(isAuthenticatedUser,authorizeRoles("merchant"),createProduct)
router.route("/details/:id").get(isAuthenticatedUser,authorizeRoles("merchant"),getProduct)

module.exports=router 