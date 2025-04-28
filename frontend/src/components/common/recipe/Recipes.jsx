import Recipe from "./Recipe";
import RecipeSkeleton from "../../skeletons/RecipeSkeleton";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

const Recipes = ({feedType}) => {
	
	const getRecipesEndpoint = () => {
		switch (feedType) {
			case "recommended":
				return "/api/recipes/discover";
			case "saved":
				return "/api/user-recipes/mine";
			default:
				return "/api/recipes/discover";
		}
	}

	const RECIPES_ENDPOINT = getRecipesEndpoint();

	const {data:recipes, isLoading, refetch, isRefetching} = useQuery({
		queryKey: ["recipes"],
		queryFn: async () => {
			try {
				const res = await fetch(RECIPES_ENDPOINT);
				const data = await res.json();
				if (!res.ok) {
					throw new Error(data.message || "Could not fetch recipes.");
				}
				return data;
			} catch (error) {
				throw new Error(error.message);
			}
		},
	});

	useEffect(() => {
		refetch();
	}, [feedType, refetch]);

	return (
		<>
			{(isLoading || isRefetching) && (
				<div className='flex flex-col justify-center'>
					<RecipeSkeleton />
					<RecipeSkeleton />
					<RecipeSkeleton />
				</div>
			)}
			{!isLoading && !isRefetching && recipes?.length === 0 && <p className='text-center my-4'>Recipe-less. We are working on it though!</p>}
			{!isLoading && !isRefetching  && recipes && (
				<div>
					{recipes.map((recipe) => (
						<Recipe key={recipe._id} recipe={recipe} />
					))}
				</div>
			)}
		</>
	);
};

export default Recipes;