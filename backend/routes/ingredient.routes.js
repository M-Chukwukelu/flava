import express from 'express';
import { protectRoute } from '../middleware/protectRoute.js';
import {
  createIngredient,
  listIngredients,
  getIngredient,
  updateIngredient,
  deleteIngredient
} from '../controllers/ingredient.controllers.js';

const router = express.Router();

// Most of these won't be used but lets just have it in there.
router.post("/", protectRoute, createIngredient);
router.get("/", protectRoute, listIngredients);
router.delete("/:id", protectRoute, deleteIngredient);
router.get("/:id", protectRoute, getIngredient);
router.put("/:id", protectRoute, updateIngredient);

export default router;
