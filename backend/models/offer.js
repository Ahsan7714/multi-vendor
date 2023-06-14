const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
  merchant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Merchant',
    required: true
  },
  store: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Store',
    required: true
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  offerTitle: {
    type: String,
    required: true
  },
  productCategory: {
    type: String,
    required: true
  },
  maxVisits: {
    type: Number,
    required: true
  },
  visits: {
    type: Number,
    required: true,
    default: 0
  },
  price: {
    type: Number,
    required: true
  },
  cashback: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  }
});

// Pre-save hook to check if maxVisits is reached and delete the offer
offerSchema.pre('save', async function (next) {
  if (this.visits >= this.maxVisits) {
    await this.remove();
  }
  next();
});

module.exports = mongoose.model('Offer', offerSchema);
