export const validateRequiredFields =(data,requiredFields)=>{
const missingFields =requiredFields.filter((field)=>!data[field]);


return{
    isValid:missingFields.length ===0,
    missingFields,
}
}

export const validateEmail = (email)=>{
 const emailRegex =/(.+)@(.+){2,}\.(.+){2,}/
 return emailRegex.test(email)
}

export const validatePassword=(password , minLength=6)=>{
    if(!password || password.length<minLength){
        return{
            isPasswordValid:false,
            message:`password must be at least ${minLength} charetcters long`
        }
    }
    return{
        isPasswordValid:true,
        message:"password is valid"
    }

}