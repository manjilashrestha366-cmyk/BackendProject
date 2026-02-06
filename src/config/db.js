import mongoose from "mongoose";
import dotenv from "dotenv"

dotenv.config()
//Define the mongodb connection
const mongoUrl = process.env.MONGO_URI

//setup the connection

mongoose.connect(mongoUrl)


//get the default connection

const db =mongoose.connection


//event listeners for the connection

db.on("connected",()=>{
    console.log("mongodb connected successfully")
})
db.on("disconnected",()=>{
    console.log("mongodb disconnected")
})
db.on("error",(err)=>{
    console.log("mongodb connection error",err)
})

export default db