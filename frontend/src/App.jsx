import { Navigate, Route, Routes } from "react-router-dom";

import HomePage from "./pages/home/HomePage";
import LoginPage from "./pages/auth/login/LogInPage";
import SignUpPage from "./pages/auth/signup/SignUpPage";
import NotificationPage from "./pages/notification/NotificationPage";
import ProfilePage from "./pages/profile/ProfilePage";
import PostPage from "./pages/individualPages/PostPage";
import RecipesPage from "./pages/recipes/RecipesPage";

import Sidebar from "./components/common/Sidebar";
import RightPanel from "./components/common/RightPanel";

import { Toaster } from "react-hot-toast";
import LoadingSpinner from "./components/common/LoadingSpinner";
import { useQuery } from "@tanstack/react-query";

function App() {
	const {data:authUser, isLoading}= useQuery({
		queryKey: ["authUser"],
		queryFn: async () => {
			try {
				const res = await fetch('/api/auth/me', {
					credentials: 'include'  
				})
				const data = await res.json();
				if (res.status === 401) {
					return null
				}
				if (!res.ok) {
					throw new Error(data.error || "Failed to fetch user data");
				}
				return data;
			} catch (error) {
				throw new Error(error.message);
			}
		},
		retry: false,
	});
	if (isLoading) {
		return (
			<div className='flex justify-center items-center h-screen'>
				<LoadingSpinner size="lg"/>
			</div>
		);
	}	
	return (
		<div className='flex max-w-6xl mx-auto'>
			{/* A common component since it is outside the routes */}
			{authUser && < Sidebar /> }
			<Routes>
				<Route path='/' element={authUser ? <HomePage />: <Navigate to="/login"/>} />
				<Route path='/signup' element={!authUser ? <SignUpPage />: <Navigate to="/"/>} />
				<Route path='/login' element={!authUser ? <LoginPage />: <Navigate to="/"/>} />
				<Route path='/notifications' element={authUser ? <NotificationPage />: <Navigate to="/login"/>} />
				<Route path='/profile/:username' element={authUser ? <ProfilePage />: <Navigate to="/login"/>} />
				<Route path="/posts/:postId" element={authUser ? <PostPage /> : <Navigate to="/login"/>} />
				<Route path="/recipes" element={authUser ? <RecipesPage />: <Navigate to="/login"/>} />
 				{/*<Route path="/recipes/saved" element={authUser ?<SavedRecipesPage />: <Navigate to="/login"/>} />
  			<Route path="/recipes/mine" element={authUser ? <MyRecipesPage />: <Navigate to="/login"/>} />
  			<Route path="/recipes/:id" element={authUser ? <RecipePage />: <Navigate to="/login"/>} />
				<Route path="/meal-planner" element={authUser ?<MealPlannerPage />: <Navigate to="/login"/>} />
				<Route path="/shopping-list" element={authUser ?<ShoppingListPage />: <Navigate to="/login"/>} />
				<Route path="/pantry" element={authUser ?<PantryPage />: <Navigate to="/login"/>} /> */}
			</Routes>
			{authUser && <RightPanel />}
			<Toaster />
		</div>
	);
}
export default App
