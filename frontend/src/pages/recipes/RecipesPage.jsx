import { useState } from "react";

import Recipes from "../../components/common/recipe/Recipes";
import CreateRecipes from "./CreateRecipes";

const RecipesPage = () => {
	const [feedType, setFeedType] = useState("recommended");

	return (
		<>
			<div className='flex-[4_4_0] mr-auto border-r border-gray-700 min-h-screen'>
				{/* Header */}
				<div className='flex w-full border-b border-gray-700'>
					<div
						className={
							"flex justify-center flex-1 p-3 hover:bg-secondary transition duration-300 cursor-pointer relative"
						}
						onClick={() => setFeedType("Recommended")}
					>
						Recommended
						{feedType === "recommended" && (
							<div className='absolute bottom-0 w-10  h-1 rounded-full bg-primary'></div>
						)}
					</div>
					<div
						className='flex justify-center flex-1 p-3 hover:bg-secondary transition duration-300 cursor-pointer relative'
						onClick={() => setFeedType("saved")}
					>
						Saved
						{feedType === "saved" && (
							<div className='absolute bottom-0 w-10  h-1 rounded-full bg-primary'></div>
						)}
					</div>
				</div>
				<Recipes feedType={feedType}/>
				<CreateRecipe />
			</div>
		</>
	);
};
export default RecipesPage;