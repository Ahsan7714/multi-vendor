const mongoose = require("mongoose");

const storeSchema = new mongoose.Schema({
  storeName: {
    type: String,
    required: true,
  },
  storeType:{
    type:String,
    required:true
  },
  logo:{
public_id:{
    type:String,
    required:true
},
url:{
    type:String,
    required:true
}
  },
  banner:{
    public_id:{
        type:String,
        required:true
    },
    url:{
        type:String,
        required:true
    }
      },
      storeLocations:[
        {
            type:String,
            required:true
        }
      ],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Merchant",
    required: true,
  },
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Store", storeSchema);
