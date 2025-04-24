import { useState } from "react";
import { Link } from "react-router-dom";

import FlavaSVG from "../../../components/svgs/flava";
import GoogleLogo from "../../../components/svgs/google.svg";

import { MdOutlineMail } from "react-icons/md";
import { MdPassword } from "react-icons/md";

import { useMutation, useQueryClient} from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import {supabase} from "../../../lib/supabase-client.js";

const LogInPage = () => {
	const [formData, setFormData] = useState({
		identifier: "",
		password: "",
	});

	const queryClient = useQueryClient();

	const {mutate:LoginMutation, isError, isPending, error} = useMutation({
		mutationFn: async (formData) => {
			try {
				const res = await fetch ("/api/auth/login", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					credentials: "include",
					body: JSON.stringify(formData),
				});
				const data = await res.json();
				if (!res.ok) {
					throw new Error(data.error || "Failed to Login");
				}
			} catch (error) {
				throw new Error(error.message);
			}	
		},
		onSuccess: () => {
			toast.success("Logged in successfully! Welcome back to Flava");
			queryClient.invalidateQueries({ queryKey: ["authUser"] });
		}
	});

	const handleSubmit = (e) => {
		e.preventDefault();
		LoginMutation(formData);
	};

	const handleInputChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleGoogle = () => {
    supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })
  }

	return (
		<div className='max-w-screen-xl mx-auto flex h-screen px-10'>
			<div className='flex-1 hidden lg:flex items-center  justify-center'>
				<FlavaSVG className='lg:w-2/3 fill-white' />
			</div>
			<div className='flex-1 flex flex-col justify-center items-center'>
				<form className='flex gap-4 flex-col' onSubmit={handleSubmit}>
					<FlavaSVG className='w-24 lg:hidden fill-white' />
					<h1 className='text-4xl font-extrabold text-black'>{"Let's"} go.</h1>
					<label className='input input-bordered rounded flex items-center gap-2'>
						<MdOutlineMail />
						<input
							type='text'
							className='grow'
							placeholder='Username or Email'
							name='identifier'
							onChange={handleInputChange}
							value={formData.identifier}
						/>
					</label>

					<label className='input input-bordered rounded flex items-center gap-2'>
						<MdPassword />
						<input
							type='password'
							className='grow'
							placeholder='Password'
							name='password'
							onChange={handleInputChange}
							value={formData.password}
						/>
					</label>
					<button className='btn rounded-full btn-primary text-white'>{isPending ? "Logging in..." : "Log In"}</button>
					{isError && <p className='text-red-500'>{error.message}</p>}
				</form>
				<div className="flex justify-center mt-6">
					<button
						type="button"
						onClick={handleGoogle}
						className="btn rounded-full btn-outline w-full flex items-center justify-center gap-2"
					>
						<img src= {GoogleLogo} alt="Google" className="h-5" />
						Log In with Google
					</button>
				</div>
				<div className='flex flex-col gap-2 mt-4'>
					<p className='text-black text-lg'>{"Don't"} have an account?</p>
					<Link to='/signup'>
						<button className='btn rounded-full btn-primary btn-outline w-full text-black hover:text-white'>Sign up</button>
					</Link>
				</div>
			</div>
		</div>
	);
};
export default LogInPage;