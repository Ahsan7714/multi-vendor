    const express = require("express");
    const app = express();
    const bodyParser = require("body-parser");
    const cors=require("cors")
    const cookieParser = require("cookie-parser");
    const errorMiddleware=require("./middelware/error")
    app.use(express.json());
    app.use(cookieParser());
    app.use(cors())
    app.use(bodyParser.urlencoded({ extended: true }));
    // importing routes
    const user=require("./routes/userRoutes")
    const merchant=require("./routes/merchantRoutes")
    const store=require("./routes/storeRoutes")
    const product=require("./routes/productRoutes")
    const offer=require("./routes/offerRoutes")

    app.use("/api/v1",user)
    app.use("/api/v1",merchant)
    app.use("/api/v1",store)
    app.use("/api/v1",product)
    app.use("/api/v1",offer)
   

    // Middleware for Errors
    app.use(errorMiddleware);
    module.exports = app;
