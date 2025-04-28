import Ingredient from '../models/ingredient.models.js';

// Create
export const createIngredient = async (req, res) => {
  try {
    const {name} = req.body;
    if (!name) return res.status(400).json({ message: "Ingredients must have a name" });
    const ing = await Ingredient.create(req.body);
    return res.status(201).json(ing);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};

// List all
export const listIngredients = async (req, res) => {
  try {
    const all = await Ingredient.find().sort('name');
    return res.json(all);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
		console.error("Error in listIngredients controller: ", error);
  }
  
};

// Read one
export const getIngredient = async (req, res) => {
  try {
    const ing = await Ingredient.findById(req.params.id);
    if (!ing) return res.status(404).json({ error: 'Not found' });
    return res.json(ing);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
		console.error("Error in getIngredient controller: ", error);
  }
  
};

// Update one. Admin Access Only!
export const updateIngredient = async (req, res) => {
  try {
    const ing = await Ingredient.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!ing) return res.status(404).json({ error: 'Not found' });
    return res.json(ing);
  } catch (err) {
    console.error("Error in updateIngredients Controller",err);
    return res.status(500).json({ error: err.message });
  }
};

// Delete one. Admin Access Only!
export const deleteIngredient = async (req, res) => {
  try {
    const ing = await Ingredient.findByIdAndDelete(req.params.id);
    if (!ing) return res.status(404).json({ error: 'Not found' });
    return res.json({ message: 'Deleted' });
  } catch (err) {
    console.error("Error in delete Ingredient", err);
    return res.status(500).json({ error: err.message });
  }
};
