import PantryItem from '../models/pantry.item.models.js';

// Add or update
export const upsertPantryItem = async (req, res) => {
  const { ingredient, quantity, unit } = req.body;
  try {
    const pi = await PantryItem.findOneAndUpdate(
      { user: req.user._id, ingredient },
      { quantity, unit, updatedAt: Date.now() },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    return res.json(pi);
  } catch (err) {
    console.error("Error in upsert Pantry Item",err);
    return res.status(500).json({ error: err.message });
  }
};

// List all
export const listPantry = async (req, res) => {
  try {
    const items = await PantryItem.find({ user: req.user._id })
      .populate('ingredient', 'name');
    return res.json(items);
  } catch (error) {
    console.error("Error in list Pantry Item",err);
    return res.status(500).json({ error: err.message });
  }
};

// Remove one
export const deletePantryItem = async (req, res) => {
  try {
    const pi = await PantryItem.findOneAndDelete({
      user: req.user._id,
      ingredient: req.params.ingredientId
    });
    if (!pi) return res.status(404).json({ error: 'Not found' });
    return res.json({ message: 'Removed' });
  } catch (error) {
    console.error("Error in delete Pantry Item",err);
    return res.status(500).json({ error: err.message });
  }
};
