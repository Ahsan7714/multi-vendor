const express=require("express")
const { createMerchant, getMerchantForUser, getMerchantAccountForMerchant, updateMerchant, deleteMerchant, requestPaymentWithdraw } = require("../controllers/merchant")
const { isAuthenticatedUser, authorizeRoles } = require("../middelware/auth")
const { checkOwnStore } = require("../middelware/ownStore")
const router=express.Router()



router.route("/merchant").post(isAuthenticatedUser,authorizeRoles("merchant") ,createMerchant)
router.route("/merchant").get(isAuthenticatedUser,authorizeRoles("merchant"),getMerchantAccountForMerchant).put(isAuthenticatedUser,authorizeRoles("merchant"),updateMerchant).delete(isAuthenticatedUser,authorizeRoles("merchant"),deleteMerchant)


// Get Merchant Details by User
router.route("/merchant/account/:merchantId").get(getMerchantForUser)

// request admin to give withdraw payment 
router.route("/merchant/request/withdraw/",isAuthenticatedUser,authorizeRoles("merchant"),checkOwnStore,requestPaymentWithdraw) 
module.exports=router