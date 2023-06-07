const express=require("express")
const { createMerchant, getAllMerchant, getMerchant, updateMerchant, deleteMerchant } = require("../controllers/merchant")
const { isAuthenticatedUser, authorizeRoles } = require("../middelware/auth")
const router=express.Router()



router.route("/account").post(isAuthenticatedUser,authorizeRoles("merchant") ,createMerchant)
router.route("/account/:merchantId").get(isAuthenticatedUser,authorizeRoles("merchant"),getMerchant).put(isAuthenticatedUser,authorizeRoles("merchant"),updateMerchant).delete(isAuthenticatedUser,authorizeRoles("merchant"),deleteMerchant)

module.exports=router