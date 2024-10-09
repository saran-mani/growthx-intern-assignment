const express= require("express")
const morgan =require("morgan")
const bodyParser =require("body-parser")
require("dotenv").config()
const  app = express()
const adminRoutes = require("./routes/Admin")
const userRoutes = require("./routes/User")
const globalErrorHandler =require("../src/error/errorController")
const { default: mongoose } = require("mongoose")
const PORT = process.env.PORT || 3000

/*****************
*  Connect MongoDB
******************/
mongoose.connect("mongodb://localhost:27017/growthxAssignment").then(()=>{
    console.log("Connected to mongoDB")
}).catch((e)=>{
    console.log(e)
    console.log("Failed to connect to mongoDB")

})
app.use(morgan('dev'))
app.use(bodyParser.json())

/**************
*  Admin APIs
***************/
app.use("/api/v1/admin",adminRoutes)

/**************
*  User APIs
***************/
app.use("/api/v1/user",userRoutes)

app.use(globalErrorHandler);

app.listen(PORT,()=>{
    console.log(`Server listen on port ${PORT}`)
})