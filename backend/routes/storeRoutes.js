const express=require("express")
const { createStore, getStore, updateStore, deleteStore } = require("../controllers/store")
const { isAuthenticatedUser, authorizeRoles } = require("../middelware/auth")
const router=express.Router()


router.route("/store").post(isAuthenticatedUser,authorizeRoles("merchant"),createStore)
router.route("/store/:id").get(isAuthenticatedUser,authorizeRoles("merchant"),getStore).put(isAuthenticatedUser,authorizeRoles("merchant"),updateStore).delete(isAuthenticatedUser,authorizeRoles("merchant"),deleteStore)


module.exports=router