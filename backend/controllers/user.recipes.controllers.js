import UserRecipe from '../models/user.recipes.models.js';

// Save one
export const saveRecipe = async (req, res) => {
  try {
    const ur = await UserRecipe.create({
      user:   req.user._id,
      recipe: req.params.recipeId
    });
    return res.status(201).json(ur);
  } catch (error) {
    console.error("Error in save recipe controller",error);
    return res.status(500).json({ error: error.message });
  }
};

// Unsave one
export const unsaveRecipe = async (req, res) => {
  try {
    const ur = await UserRecipe.findOneAndDelete({
      user: req.user._id,
      recipe: req.params.recipeId
    });
    if (!ur) return res.status(404).json({ error: 'Not saved' });
    return res.json({ message: 'Removed' });
  } catch (error) {
    console.error("Error in save recipe controller",error);
    return res.status(500).json({ error: error.message });
  }
};

// List all saved
export const getSavedRecipes = async (req, res) => {
 try {
  const list = await UserRecipe.find({ user: req.user._id })
    .populate({ path: 'recipe', populate: 'createdBy ingredients.ingredient' });
  return res.json(list.map(u => u.recipe));
 } catch (error) {
    console.error("Error in get saved recipes controller",error);
    return res.status(500).json({ error: error.message });
 }
};
