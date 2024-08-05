const mongoose = require("mongoose");
const dotenv = require("dotenv")
dotenv.config()
const MONGODB_URI = process.env.mongodb_url;
mongoose.connect(MONGODB_URI)
.then(()=>{
    console.log("Mongoose connected successfully");
})
.catch(()=>{
    console.log("An error occured on mongoose");
})