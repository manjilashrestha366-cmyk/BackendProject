import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { createRecipe, getRecipe,getRecipeById, updateRecipe,deleteRecipe } from "../controllers/recipe.controller.js";
import upload from "../config/multer.js";
import { cloudinaryUpload } from "../config/cloudinaryUpload.js";


const router=express.Router()


// router.post("/",protect,(req,res)=>{
//     res.send("recepie created")
// })

// router.post("/",protect,createRecipe)

router.post(
  "/",
  protect,
  upload.array("images", 5),
  cloudinaryUpload,
  createRecipe,
);


//get all recipes
router.get("/",getRecipe)


//get a recipe
router.get("/:id",getRecipeById)

//update
router.put(
  "/:id",
  protect,
  upload.array("Images",5),
  cloudinaryUpload,
  updateRecipe
)
//delete
router.delete("/:id",protect,deleteRecipe)


export default router