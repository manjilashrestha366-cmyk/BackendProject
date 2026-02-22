import cloudinary from "../config/cloudinary.js";

export const deleteImagefromCloudinary = async(imageUrl)=>{
    const parts = imageUrl.split('/')
    const publicIdWithExt= parts[parts.length-1];
    const publicId = "project_s2/"+publicIdWithExt.split(".")[0];
    return await cloudinary.uploader.destroy(publicId)



}

export const deleteMultipleImages = async(imageUrls)=>{
    if(!imageUrls || imageUrls.length===0){
        return [];
    }
    const deletePromises = imageUrls.map((url)=>deleteImagefromCloudinary(url));
    return await Promise.all(deletePromises)
}