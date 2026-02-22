import multer from "multer";
const storage = multer.memoryStorage();

const fileFilter = (req,file,cb)=>{
const allowedTypes = ['image/jpeg','image/jpg','image/png'];
if(!allowedTypes.includes(file.mimetype)){
    return cb(new Error ("only jpg,jpeg and png images are allowed"))
}
cb(null,true)

};

const upload = multer({
    storage,
    fileFilter,
    limits:{fileSize:5*1024*1024} //5mb
})


export default upload