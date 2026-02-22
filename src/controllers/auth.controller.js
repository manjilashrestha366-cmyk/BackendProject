import { sendError } from "../utils/responseHandler.js";
import { validateEmail, validatePassword, validateRequiredFields } from "../utils/validation.js";
import User from "../models/user.model.js";
import { findOne } from "../utils/crudOperations.js";
import { generateToken } from "../utils/jwtUtils.js";

export const register = async(req,res)=>{
   const {username,email,password} =req.body;
  try {
    
    const {isValid} = validateRequiredFields(req.body,[
        "username",
        "email",
        "password"
    ]);

    if(!isValid){
       return sendError(res,400,"Please fill all fields")
       
    }

    const isValidEmail =  validateEmail(email)
    if(!isValidEmail){
      return sendError(res,400,"please enter a valid email")
    }


    const{isPasswordValid,message}=validatePassword(password)
    if(!isPasswordValid){
         return sendError(res,400,message)
    }


    const userExists = await findOne(User,{email})

    if(userExists){
        return sendError(res,400,"user already exists")
    }


  const newUser = new User({
    username,email,password
  })

  
  const user = await newUser.save()
  
  const token = generateToken(user._id)

  res.status(201).json({
     _id:user._id,
    username:user.username,
    email:user.email,
    token
  })

   
    
    
  } catch (error) {
    console.log("Registration error:",error)
    sendError(res,500,"server error")
  }

}


export const login = async(req,res)=>{
const {email,password}= req.body;
try {

    const {isValid} = validateRequiredFields(req.body,[
        "email",
        "password"
    ]);
    
    if(!isValid){
       return sendError(res,400,"Please fill all fields")
       
    }
 
    const user = await findOne(User,{email})

    if(!user || !(await user.comparePassword(password))){
        return sendError(res,401,"invalid credentials");

    }

  const token = generateToken(user._id)

   res.status(200).json({
    _id:user._id,
    username:user.username,
    email:user.email,
    token
   })

   

  } catch (error) {
    console.log("Login error:",error)
    sendError(res,500,"server error")
  }
}