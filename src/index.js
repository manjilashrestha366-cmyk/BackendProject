import express from "express"
import dotenv from "dotenv"
import authRoutes from "./routes/auth.routes.js" 
import db from "./config/db.js"
dotenv.config()

const app = express()
const port =process.env.PORT
app.use(express.json())

app.get("/",(req,res)=>{
res.json({message:"your service is running live"})
})

//Routes
app.use("/api/auth",authRoutes)





app.listen(port,()=>{
console.log(`server is running on the port : ${port}`)
})