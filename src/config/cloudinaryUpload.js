import cloudinary from "./cloudinary.js";
import { sendError } from "../utils/responseHandler.js";


// function uploadToCloudinary(fileBuffer){
//     const stream = cloudinary.uploader.upload_stream(
//         {folder:"MernBackend"},
//         (error,result)=>{
//             if(error) return reject(error);
//             resolve(result.secure_url);
//         }
//     )
//     stream.end(fileBuffer)
// }

// function uploadToCloudinary(fileBuffer){
    
//     return new Promise((resolve,reject)=>{
       
//         const stream = cloudinary.uploader.upload_stream(
//         {folder:"project-s2"},
//         (error,result)=>{
//             if(error) return reject(error);
//             return resolve(result.secure_url);
//         }
        
//     )
//     console.log("stream",stream)
//     stream.end(fileBuffer)
//     })
// }

function uploadToCloudinary(fileBuffer){
    console.log("uploading to cloudinary...",fileBuffer)

    return new Promise((resolve,reject)=>{

        
    cloudinary.uploader.upload_stream(
        {folder:"project_s2"},
        (error,result)=>{
            // console.log(error)
            if(error) return reject(error);
          return resolve(result);
        }
    )
    .end(fileBuffer)
    })
}


//middleware to upload images
export const cloudinaryUpload = async(req,res,next)=>{
    try {
       
        if(!req.files || req.files.length ===0){
            req.cloudinaryImages = [];
            return next()
        }
    
        // const urls = await Promise.all(req.files.map((file)=>uploadToCloudinary(file.buffer)))
        // console.log("sdgsadgu")
        // console.log("urls",urls)
console.log(req.files[0].buffer)
        const urls = await uploadToCloudinary(req.files[0].buffer)
        console.log("urls",urls)
        req.cloudinaryImages.push(urls);
        // console.log(req.cloudinaryImages)
        next();
    } catch (error) {
        return sendError(res,500,"image upload failed"+error.message)
    }
}


