import mongoose from 'mongoose';

const RecipeIngredientSchema = new mongoose.Schema(
  {
    ingredient: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Ingredient', 
      required: true 
    },
    quantity: { 
      type: Number, 
      required: true 
    },
    unit: { 
      type: String, 
      default: '' 
    }, 
    note: {
      type: String,
      default: ""
    },
  }
);

const RecipeSchema = new mongoose.Schema(
  {
    title: { 
      type: String, 
      required: true 
    },
    description: String,
    ingredients: [
      {
        type: RecipeIngredientSchema,
        default: []
      },
    ],
    instructions: [
      {
        type: String,
        default: []
      },
    ],
    imageUrl: {
      type: String,
      default: ""
    },
    createdBy: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
  }, { timestamps: true }
);

const Recipe = mongoose.model("Recipe", RecipeSchema);
export default Recipe;
