import mongoose from 'mongoose';
// Recipes they have saved.
const UserRecipeSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  recipe: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Recipe', 
    required: true 
  },
  addedAt: { 
    type: Date, 
    default: Date.now 
  },
});

UserRecipeSchema.index({ user: 1, recipe: 1 }, { unique: true });

const userRecipes = mongoose.model('UserRecipe', UserRecipeSchema);

export default userRecipes;
