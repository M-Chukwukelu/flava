import express from 'express';
import { protectRoute } from '../middleware/protectRoute.js';
import {
  createRecipe,
  getMyRecipes,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
  getDiscoverRecipes
} from '../controllers/recipe.controllers.js';

const router = express.Router();

router.use(protectRoute);

router.post('/', createRecipe);
router.get('/mine', getMyRecipes);
router.get('/:id', getRecipeById);
router.put('/:id', updateRecipe);
router.delete('/:id', deleteRecipe);
router.get('/discover', protectRoute, getDiscoverRecipes);

export default router;
