const express=require("express")
const { registerUser, getUser, loginUser, forgotPassword, resetPassword, updatePassword, logout} = require("../controllers/user")
const { isAuthenticatedUser } = require("../middelware/auth")
const router=express.Router()

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/logout").post(logout)
router.route("/account").get(getUser)
router.route("/password/forgot").post(forgotPassword)
router.route("/password/reset/:token").post(resetPassword)
router.route("/password/update").put(isAuthenticatedUser,updatePassword)







module.exports=router