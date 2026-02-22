import { sendError } from "../utils/responseHandler.js";
import { validateRequiredFields } from "../utils/validation.js";
import Recipe from "../models/recipe.model.js";
import { deleteMultipleImages } from "../utils/cloudinaryUtils.js";
import { findById } from "../utils/crudOperations.js";


export const createRecipe = async(req,res)=>{
const {title,ingredients,instructions,category,cookingTime} = req.body;

try {
   
     const {isValid} = validateRequiredFields(req.body,[
           "title",
           "ingredients",
           "instructions",
           "category",
           "cookingTime" 
        ]);
        if(!isValid){
            console.log("validation failed : missing required fields")
            return sendError(res,400,"please fill all the fields")
        }

        if(!req.cloudinaryImages || req.cloudinaryImages.length ===0){
            console.log("no images uploaded");
            return sendError(res,400,"please upload at least one image")
        }

         //create
        const recipeData = {
            title,
            ingredients,
            instructions,
            category,
            cookingTime,
            photoUrls:req.cloudinaryImages,
            createdBy:req.user._id
        };
        console.log("creating recipe :",recipeData);
        const newRecipe = new Recipe(recipeData);
        const savedRecipe = await newRecipe.save();
        console.log("recipe created sucessfully",savedRecipe._id);
        res.status(201).json(savedRecipe)

} catch (error) {
    console.error("create recipe error:",error.message)
    sendError(res,500,"server error "+ error.message)

}

}


export const getRecipe =async(req,res)=>{
const { category } = req.query;

  try {
    console.log("category", category);
    let query = {};
    if (category && category !== "All") {
      query.category = { $regex: new RegExp(`^${category}$`, "i") };
    }
    // query.category = category
    console.log("query:", query);
    const recipes = await Recipe.find(query).populate(
      "createdBy",
      "username email",
    );
    res.json(recipes);
  } catch (error) {
    console.log("error on getting recipes", error);
    sendError(res, 500, "server error " + error);
  }
};

export const getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id).populate(
      "createdBy",
      "username email",
    );
    if (!recipe) {
      return sendError(res, 404, "Recipe not found");
    }
    res.json(recipe);
    
  } catch (error) {
    console.log("Get recipe error:", error);
    sendError(res, 500, "server error");
  }
};


export const updateRecipe  = async(req,res)=>{
     const { title, ingredients, instructions, category, cookingTime } = req.body;
     try {
        const recipe = await Recipe.findById(req.params.id);
        if(!recipe){
            return sendError(res,404,"Recipe not found")
        }
        //check auth
        if(recipe.createdBy.toString()!==req.user._id.toString()){
            return sendError(res,401,"not authorized")
        }

        //merge old and new images
        let photoUrls = recipe.photoUrls || [];
        if(req.cloudinaryImages && req.cloudinaryImages.length>0){
            photoUrls= [...photoUrls,...req.cloudinaryImages]
        }

        //update fileds
        recipe.title=title || recipe.title;
        recipe.ingredients=ingredients || recipe.ingredients;
        recipe.instructions = instructions || recipe.instructions;
        recipe.category = category || recipe.category;
        recipe.photoUrls = photoUrls;
        recipe.cookingTime = cookingTime || recipe.cookingTime;
        const updatedRecipe = await recipe.save();
        res.json(updatedRecipe)

     } catch (error) {
        console.log("update recipe error",error)
        sendError(res,500,"server Error")
     }
}
export const deleteRecipe = async(req,res)=>{
    try {
        const recipe = await Recipe.findById(req.params.id);
        if(!recipe){
            return sendError(res,404,"Recipe not found")
        }
        //check auth
        if(recipe.createdBy.toString()!==req.user._id.toString()){
            return sendError(res,401,"not authorized")
        }
        //delete image from cloudinary
       await deleteMultipleImages(recipe.photoUrls)
        //delete recipe
        await recipe.deleteOne();
        res.json({message:"Recipe Deleted"})
    } catch (error) {
        console.log("Delete recipe error:",error)
        sendError(res,500,"server error")
    }
}