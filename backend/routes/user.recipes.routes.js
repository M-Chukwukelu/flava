import express from 'express';
import { protectRoute } from '../middleware/protectRoute.js';
import {
  saveRecipe,
  unsaveRecipe,
  getSavedRecipes
} from '../controllers/user.recipes.controllers.js';

const router = express.Router();

router.use(protectRoute);

router.post  ('/:recipeId', saveRecipe);
router.delete('/:recipeId', unsaveRecipe);
router.get   ('/mine',      getSavedRecipes);

export default router;
