const express = require('express');
const router = express.Router();

const {
  createOffer,
  getAllOffers,
  getOfferById,
  updateOffer,
  deleteOffer,
  getAllOffersOfStore,
} = require('../controllers/offer.js');
const { isAuthenticatedUser, authorizeRoles } = require('../middelware/auth');
const { checkOwnStore } = require('../middelware/ownStore.js');

// Create a new offer
router.route('/product/:id/offer').post(isAuthenticatedUser,checkOwnStore,authorizeRoles("merchant"),createOffer);

// Get all offers {Merchant}
router.route('/offers').get(isAuthenticatedUser,authorizeRoles("merchant"),getAllOffers);
// get all offers a store
router.route('/store/:id/offers').get(getAllOffersOfStore);

// Get a single offer by ID
router.route('/offer/:id').get(getOfferById).put(isAuthenticatedUser,authorizeRoles("merchant"),updateOffer).delete(isAuthenticatedUser,authorizeRoles("merchant"),deleteOffer);
module.exports = router;
