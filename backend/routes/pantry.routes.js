import express from 'express';
import { protectRoute } from '../middleware/protectRoute.js';
import {
  upsertPantryItem,
  listPantry,
  deletePantryItem
} from '../controllers/pantry.controllers.js';

const router = express.Router();

router.use(protectRoute);

router
  .route('/')
  .get(listPantry)
  .post(upsertPantryItem);

router.delete('/:ingredientId', deletePantryItem);

export default router;
