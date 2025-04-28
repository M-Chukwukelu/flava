// src/components/recipes/RecipeCard.jsx
import { Link, useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FaRegBookmark, FaTrash } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function Recipe({ recipe }) {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { _id, title, imageUrl, createdBy, ingredients } = recipe;
  // whether I saved this?
  const saved = recipe.isSaved; // you can flag this on the API

  const saveMut = useMutation({
    mutationFn: () => fetch(`/api/user-recipes/${_id}`, {
      method: saved ? 'DELETE' : 'POST',
    }),
    onSuccess: () => {
      toast.success(saved ? 'Removed' : 'Saved');
      qc.invalidateQueries({ queryKey: ['recipes','saved'] });
    }
  });

  return (
    <div className="p-4 border-b border-gray-700 flex gap-4 cursor-pointer"
         onClick={()=>navigate(`/recipes/${_id}`)}>
      <img src={imageUrl||'/placeholder.png'} alt="" className="h-20 w-20 object-cover rounded" />
      <div className="flex-1">
        <h3 className="font-bold">{title}</h3>
        <p className="text-sm text-gray-500">
          by {createdBy.profileName} — {ingredients.length} ingredients
        </p>
      </div>
      <button onClick={e=>{e.stopPropagation(); saveMut.mutate()}}>
        <FaRegBookmark className={saved ? 'text-yellow-400' : ''}/>
      </button>
    </div>
  );
}
