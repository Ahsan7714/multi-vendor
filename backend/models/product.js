const mongoose=require("mongoose")

const productSchema=new mongoose.Schema({
    productName:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    stock:{
        type:Number,
        required:true
    },
    totalRating:{
        type:Number,
        required:true
    },
    reviews:[
        {
            user:{
                type:mongoose.Schema.Types.ObjectId,
                required:true
            },
            name:{
                type:String,
                required:true
            },

            comment:{
                type:String,
                required:true
            },
            rating:{
                type:Number,
                required:true
            }
        }
    ],
    images:[
        {
            public_id: {
                type: String,
                required: true,
              },
              url: {
                type: String,
                required: true,
              },
        }
    ],
    numOfReviews: {
        type: Number,
        default: 0,
      },
      merchant: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
      },
      store: {
        type: mongoose.Schema.ObjectId,
        ref: "Store",
        required: true,
      },
      offer:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Offer"
      }],
      createdAt: {
        type: Date,
        default: Date.now,
      }

})

module.exports=mongoose.model("Product",productSchema)