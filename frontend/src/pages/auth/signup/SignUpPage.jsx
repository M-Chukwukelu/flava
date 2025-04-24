import { Link } from "react-router-dom";
import { useState } from "react";

import FlavaSVG from "../../../components/svgs/flava";

import { MdOutlineMail } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { MdPassword } from "react-icons/md";
import { MdDriveFileRenameOutline } from "react-icons/md";

import { useMutation, useQueryClient} from "@tanstack/react-query";
import { toast } from "react-hot-toast";

const SignUpPage = () => {
	const [formData, setFormData] = useState({
		email: "",
		username: "",
		firstName: "",
    lastName: "",
		password: "",
	});

	const queryClient = useQueryClient();

	const {mutate, isError, isPending, error} = useMutation({
		mutationFn: async (formData) => {
			try {
				const res = await fetch ("/api/auth/signup", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					credentials: "include",
					body: JSON.stringify(formData),
				});
				const data = await res.json();
				if (!res.ok) {
					throw new Error(data.error || "Failed to Create Account");
				}
				
				
				return data;
			} catch (error) {
				throw new Error(error.message);
			}	
		},
		onSuccess: () => {
			toast.success("Account created successfully! Please check your email to verify your account.");
			queryClient.invalidateQueries({ queryKey: ["authUser"] });
		}
	});

	const handleSubmit = (e) => {
		e.preventDefault(); // Prevent the form from reloading the page
		mutate(formData); // Call the mutation function with the form data
	};

	const handleInputChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};


	return (
		<div className='max-w-screen-xl mx-auto flex h-screen px-10'>
			<div className='flex-1 hidden lg:flex items-center  justify-center'>
				<FlavaSVG className=' lg:w-2/3 fill-white' />
			</div>
			<div className='flex-1 flex flex-col justify-center items-center'>
				<form className='lg:w-2/3  mx-auto md:mx-20 flex gap-4 flex-col' onSubmit={handleSubmit}>
					<FlavaSVG className='w-24 lg:hidden fill-white' />
					<h1 className='text-4xl font-extrabold text-black'>Join today.</h1>
					<label className='input input-bordered rounded flex items-center gap-2'>
						<MdOutlineMail />
						<input
							type='email'
							className='grow'
							placeholder='Email'
							name='email'
							onChange={handleInputChange}
							value={formData.email}
						/>
					</label>
          <label className='input input-bordered rounded flex items-center gap-2'>
							<FaUser />
							<input
								type='text'
								className='grow '
								placeholder='Username'
								name='username'
								onChange={handleInputChange}
								value={formData.username}
							/>
						</label>
					<div className='flex gap-4 flex-wrap'>
						<label className='input input-bordered rounded flex items-center gap-2 flex-1'>
              <MdDriveFileRenameOutline />
							<input
								type='text'
								className='grow '
								placeholder='First Name'
								name='firstName'
								onChange={handleInputChange}
								value={formData.firstName}
							/>
						</label>
						<label className='input input-bordered rounded flex items-center gap-2 flex-1'>
							<MdDriveFileRenameOutline />
							<input
								type='text'
								className='grow'
								placeholder='Last Name'
								name='lastName'
								onChange={handleInputChange}
								value={formData.lastName}
							/>
						</label>
					</div>
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
					<button className='btn rounded-full btn-primary text-white'>
						{isPending ? "Signing up..." : "Sign up"}
					</button>
					{isError && <p className='text-red-500'>{error.message}</p>}
				</form>
				<div className='flex flex-col lg:w-2/3 gap-2 mt-4'>
					<p className='text-black text-lg'>Already enjoying the flavour?</p>
					<Link to='/login'>
						<button className='btn rounded-full btn-primary text-black hover:text-white btn-outline w-full'>Sign in</button>
					</Link>
				</div>
			</div>
		</div>
	);
};
export default SignUpPage;