import mongoose from "mongoose";

const IngredientSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: true, 
      unique: true 
    },
    allergen: { 
      type: Boolean, 
      default: false 
    },
    notes: {
      type: String,
      default: ""
    },
  }, { timestamps: true }
);

const Ingredient = mongoose.model("Ingredient", IngredientSchema);

export default Ingredient;
