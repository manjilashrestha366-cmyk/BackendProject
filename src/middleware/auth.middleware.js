import jwt from "jsonwebtoken";
import { verifyToken } from "../utils/jwtUtils.js";
import User from "../models/user.model.js";
import { findById } from "../utils/crudOperations.js";
import { sendError } from "../utils/responseHandler.js";


export const protect = async(req,res,next)=>{
    let token;
   if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
        token = req.headers.authorization.split(" ")[1]
        console.log("token",token)


        // const decoded = jwt.verify(token,process.env.JWT_SECRET)  
        const decoded = verifyToken(token);
        req.user = await User.findById(decoded.id).select("-password");
        if(!req.user){
            return sendError(res,401,"User not found")
        };

        return next()
    } catch (error) {
       console.error("token is not verified", error.message)
        return sendError(res,401,"not authorized as creator ")
    }
   }

   if(!req.headers.authorization){
    return sendError(res,401,"no authorization header provided")
}


return sendError(res,401,"no token provided")

}