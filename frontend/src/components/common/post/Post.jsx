import { FaRegComment } from "react-icons/fa";
import { BiRepost } from "react-icons/bi";
import { FaRegHeart } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import LoadingSpinner from "../LoadingSpinner.jsx";
import { useAuthUser } from "../../../hooks/useAuthUser";
import {formatPostDate} from "../../../utils/date/formatDate.js";

const Post = ({ post }) => {
	const navigate = useNavigate();
	const {data: authUser} = useAuthUser();

	const queryClient = useQueryClient();

	const { isComment, parentId } = post;

	const {mutate: deletePost, isPending: isDeleting} = useMutation({
		mutationFn: async () => {
			try {
				const res = await fetch(`/api/posts/${post._id}`, {
					method: "DELETE",
					headers: {
						"Content-Type": "application/json",
					},
				})
				const data = await res.json();
				if (!res.ok) {
					throw new Error(data.message);
				}
				return data;
			} catch (error) {
				throw new Error(error.message);
			}
		},
		onSuccess: () => {
			toast.success("Post deleted successfully");
			// Invalidate the query to refetch the posts
			queryClient.invalidateQueries({ queryKey: ["posts"] });
			if (isComment && parentId) {
				queryClient.invalidateQueries({ queryKey: ["comments", parentId] });
			}
			
		},
	});

	const {mutate: likePost, isPending : isLiking} = useMutation({
		mutationFn: async () => {
			try {
				const res = await fetch(`/api/posts/like/${post._id}`, {
					method: "POST",
				});
				const data = await res.json();
				if (!res.ok) {
					throw new Error(data.error || "Something went wrong");
				}
				return data;
			} catch (error) {
				throw new Error (error.message);
			}
		},
		onSuccess: (updatedLikes) => {
			queryClient.setQueryData(["posts"], (oldData) => {
				return oldData.map((p) => {
					if (p._id === post._id) {
						return { ...p, likes: updatedLikes };
					}
					return p;
				});
			});
		},
		onError: (error) => {
			toast.error(error.message || "Couldn't Like Post");
		},
	});

	const postOwner = post.user;
	const isLiked = post.likes.includes(authUser._id);

	const isMyPost = authUser._id === post.user._id;

	const formattedDate = formatPostDate(post.createdAt);

	const handleDeletePost = () => {
		deletePost();
	};

	const handleLikePost = () => {
		if (isLiking) {
			return
		};
		likePost();
	};

	return (
		<>
			<div className='flex gap-2 items-start p-4 border-b border-gray-700'>
				<div className='avatar'>
					<Link to={`/profile/${postOwner.username}`} className='w-8 rounded-full overflow-hidden'>
						<img src={postOwner.profileImg || "/avatar-placeholder.png"} />
					</Link>
				</div>
				<div className='flex flex-col flex-1'>
					<div className='flex gap-2 items-center'>
						<Link to={`/profile/${postOwner.username}`} className='font-bold'>
							{postOwner.profileName}
						</Link>
						<span className='text-gray-700 flex gap-1 text-sm'>
							<Link to={`/profile/${postOwner.username}`}>@{postOwner.username}</Link>
							<span>·</span>
							<span>{formattedDate}</span>
						</span>
						{isMyPost && (
							<span className='flex justify-end flex-1'>
								{!isDeleting && <FaTrash className='cursor-pointer hover:text-red-500' onClick={handleDeletePost} />}
								{isDeleting && (
									<LoadingSpinner size="sm"/>
								)}
							</span>
						)}
					</div>
					<div
						className='flex flex-col gap-3 overflow-hidden'
						onClick={() => navigate(`/posts/${post._id}`)}
					>
						<span>{post.text}</span>

						{post.img && (
							<img
								src={post.img}
								className='h-80 object-contain rounded-lg border border-gray-700'
								alt=''
								onClick={e => e.stopPropagation()}
							/>
						)}
					</div>
					<div className='flex justify-between mt-3'>
						<div className='flex gap-4 items-center w-2/3 justify-between'>
							<div
								className='flex gap-1 items-center cursor-pointer group'
								onClick={() => navigate(`/posts/${post._id}`)}
							>
								<FaRegComment className='w-4 h-4  text-slate-500 group-hover:text-sky-400' />
								<span className='text-sm text-slate-500 group-hover:text-sky-400'>
									{post.commentCount}
								</span>
							</div>
							<div className='flex gap-1 items-center group cursor-pointer'>
								<BiRepost className='w-6 h-6  text-slate-500 group-hover:text-green-500' />
								<span className='text-sm text-slate-500 group-hover:text-green-500'>0</span>
							</div>
							<div className='flex gap-1 items-center group cursor-pointer' onClick={handleLikePost}>
								{isLiking && <LoadingSpinner size='sm'/>}
								{!isLiked && !isLiking && (
									<FaRegHeart className='w-4 h-4 cursor-pointer text-slate-500 group-hover:text-pink-500' />
								)}
								{isLiked && !isLiking && <FaRegHeart className='w-4 h-4 cursor-pointer text-pink-500 ' />}

								<span
									className={`text-sm group-hover:text-pink-500 ${
										isLiked ? "text-pink-500": "text-slate-500"
									}`}
								>
									{post.likes.length}
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};
export default Post;