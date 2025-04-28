import Recipe from '../models/recipe.models.js';

// Create
export const createRecipe = async (req, res) => {
  try {
    const r = await Recipe.create({
      ...req.body,
      createdBy: req.user._id
    });
    return res.status(201).json(r);
  } catch (error) {
    console.error("Error in createRecipe controller",error);
    return res.status(500).json({ error: error.message });
  }
};

// List “my recipes”
export const getMyRecipes = async (req, res) => {
  try {
    const list = await Recipe.find({ createdBy: req.user._id })
      .sort('-createdAt')
      .populate('ingredients.ingredient', 'name');
    return res.json(list);
  } catch (error) {
    console.error("Error in getMyRecipes controller",error);
    return res.status(500).json({ error: error.message });
  }
};

// Read single
export const getRecipeById = async (req, res) => {
  try {
    const r = await Recipe.findById(req.params.id)
      .populate('createdBy', 'profileName username')
      .populate('ingredients.ingredient', 'name');
    if (!r) return res.status(404).json({ error: 'Not found' });
  return res.json(r);
  } catch (error) {
    console.error("Error in getRecipebyId controller",error);
    return res.status(500).json({ error: error.message });
  }
};

// Update (only owner)
export const updateRecipe = async (req, res) => {
  try {
    const r = await Recipe.findById(req.params.id);
    if (!r) return res.status(404).json({ error: 'Not found' });
    if (!r.createdBy.equals(req.user._id))
      return res.status(403).json({ error: 'Unauthorized' });
    Object.assign(r, req.body);
    await r.save();
    return res.json(r);
  } catch (error) {
    console.error("Error in updateRecipe controller", error);
    return res.status(500).json({ error: error.message });
  }
};

// Delete (only owner)
export const deleteRecipe = async (req, res) => {
  try {
    const r = await Recipe.findById(req.params.id);
    if (!r) return res.status(404).json({ error: 'Not found' });
    if (!r.createdBy.equals(req.user._id))
      return res.status(403).json({ error: 'Unauthorized' });
    await r.remove();
    return res.json({ message: 'Deleted' });
  } catch (error) {
    console.error("Error in deleteRecipe controller", error);
    return res.status(500).json({ error: error.message });
  }
};

export const getDiscoverRecipes = async (req, res) => {
  try {
    const userId = req.user._id;

    const savedDocs = await UserRecipe.find({ user: userId }).select('recipe');
    const savedIds  = savedDocs.map(doc => doc.recipe);

    const recipes = await Recipe.find({
      createdBy: { $ne: userId },
      _id:       { $nin: savedIds }
    })
      .sort({ createdAt: -1 })
      .populate({ path: 'createdBy', select: '-password' });

    return res.status(200).json(recipes);
  } catch (error) {
    console.error('error in discover recipes controller:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
