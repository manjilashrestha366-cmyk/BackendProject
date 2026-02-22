import jwt from "jsonwebtoken"

//generate token

export const generateToken =(id,expiresIn="30d")=>{
    return jwt.sign({id},process.env.JWT_SECRET,{expiresIn});
}

//verify

export const verifyToken=(token)=>{
    return jwt.verify(token,process.env.JWT_SECRET)
}