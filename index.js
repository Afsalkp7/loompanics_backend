const express = require('express')
const app = express()
const dotenv = require("dotenv")
const mongoose = require("./database/connect");
const PORT = process.env.PORT || 3000
const bodyParser = require("body-parser")
app.use(bodyParser.json());

// app.use('/api/user',userRoutes)

app.get('/',(req,res)=>{
    res.status(200).json({'success':"working"})
})

app.listen(PORT, () => {console.log(`Connecting to port ${PORT}...`)});