import mongoose from "mongoose";
import bcrypt from "bcryptjs"

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    }
}

,{
    timestamps:true
})

userSchema.pre("save", async function(){
    const user = this;
    if(!user.isModified("password")) return;
    try {
        const salt = await bcrypt.genSalt(10)
        user.password= await bcrypt.hash(user.password,salt)
    } catch (error) {
        throw error
    }

})

//compare password



const User = mongoose.model("User",userSchema)
export default User