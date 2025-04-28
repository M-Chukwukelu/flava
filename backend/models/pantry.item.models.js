import mongoose from 'mongoose';

const PantryItemSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
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
  updatedAt: { 
    type: Date, 
    default: Date.now 
  },
});

PantryItemSchema.index({ user:1, ingredient:1 }, { unique: true });

const PantryItem = mongoose.model('PantryItem', PantryItemSchema);

export default PantryItem;