const express=require("express")
const { createStore, getStore } = require("../controllers/store")
const { isAuthenticatedUser, authorizeRoles } = require("../middelware/auth")
const router=express.Router()


router.route("/create").post(isAuthenticatedUser,authorizeRoles("merchant"),createStore)
router.route("/details/:id").get(isAuthenticatedUser,authorizeRoles("merchant"),getStore)


module.exports=router