import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Post from "../../components/common/post/Post.jsx";
import PostSkeleton from "../../components/skeletons/PostSkeleton.jsx";
import CreatePost from "../home/CreatePost.jsx";

// A small helper component to fetch and render comments
function CommentsList({ parentId }) {
  const { data: comments = [], isLoading } = useQuery({
    queryKey: ["comments", parentId],
    queryFn: async () => {
      const res = await fetch(`/api/posts/comments/${parentId}`, {
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error("Failed to fetch comments");
      }
      return data;
    },
  });

  if (isLoading) {
    return <PostSkeleton />;
  }

  return (
    <div>
      {comments.map((c) => (
        <Post key={c._id} post={c} />
      ))}
    </div>
  );
}

export default function PostPage() {
  const { postId } = useParams();

  // Fetch the main post
  const { data: post, isLoading: isPostLoading } = useQuery({
    queryKey: ["post", postId],
    queryFn: async () => {
      const res = await fetch(`/api/posts/${postId}`, {
        credentials: "include",
      });
      if (!res.ok) {
        throw new Error("Failed to fetch post");
      }
      return res.json();
    },
  });

  if (isPostLoading) {
    return <PostSkeleton />;
  }

  return (
    <div className="flex-[4_4_0] mr-auto border-r border-gray-700 min-h-screen">
      {/* Header: render the main post slightly larger */}
      <div className="border-b border-gray-700 p-6">
        <Post post={post} />
      </div>

      <CommentsList parentId={postId} />

      <CreatePost isComment={true} parentId={postId}/>
    </div>
  );
}
