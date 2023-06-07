const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const errorMiddleware=require("./middelware/error")
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
// importing routes
const user=require("./routes/userRoutes")
const merchant=require("./routes/merchantRoutes")
const store=require("./routes/storeRoutes")
const product=require("./routes/productRoutes")
app.use("/api/v1/user",user)
app.use("/api/v1/merchant",merchant)
app.use("/api/v1/store",store)
app.use("/api/v1/product",product)


// Middleware for Errors
app.use(errorMiddleware);
module.exports = app;
