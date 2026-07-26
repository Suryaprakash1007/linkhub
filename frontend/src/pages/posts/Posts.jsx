import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { createPost, getPosts, deletePost, likePost, unlikePost } from "../../services/postService";
import toast from "react-hot-toast";
import {
    MessageSquare,
    Heart,
    Trash2,
    Send,
    Image,
    Loader2,
    User,
    Clock,
    ThumbsUp,
    AlertCircle
} from "lucide-react";
import useAuth from "../../hooks/useAuth";

export default function Posts() {
    const { user } = useAuth();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [content, setContent] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [likingPosts, setLikingPosts] = useState(new Set());

    useEffect(() => {
        loadPosts();
    }, []);

    const loadPosts = async () => {
        setLoading(true);
        try {
const data = await getPosts();
            setPosts(data || []);
        } catch (error) {
            toast.error("Failed to load posts");
        } finally {
            setLoading(false);
        }
    };

    const handleCreatePost = async (e) => {
        e.preventDefault();
        if (!content.trim()) {
            toast.error("Post content cannot be empty");
            return;
        }
        setSubmitting(true);
        try {
            const newPost = await createPost({
                content: content.trim(),
                imageUrl: imageUrl.trim() || null,
            });
            setPosts([newPost, ...posts]);
            setContent("");
            setImageUrl("");
            toast.success("Post created!");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to create post");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeletePost = async (postId) => {
        if (!window.confirm("Delete this post?")) return;
        try {
            await deletePost(postId);
            setPosts(posts.filter((p) => p.id !== postId));
            toast.success("Post deleted");
        } catch (error) {
            toast.error("Failed to delete post");
        }
    };

    const handleLikeToggle = async (post) => {
        if (likingPosts.has(post.id)) return;
        setLikingPosts((prev) => new Set(prev).add(post.id));
        try {
            if (post.likedByUser) {
                await unlikePost(post.id);
                setPosts(
                    posts.map((p) =>
                        p.id === post.id
                            ? { ...p, likedByUser: false, likeCount: Math.max(0, p.likeCount - 1) }
                            : p
                    )
                );
            } else {
                await likePost(post.id);
                setPosts(
                    posts.map((p) =>
                        p.id === post.id
                            ? { ...p, likedByUser: true, likeCount: p.likeCount + 1 }
                            : p
                    )
                );
            }
        } catch (error) {
            toast.error("Failed to update like");
        } finally {
            setLikingPosts((prev) => {
                const next = new Set(prev);
                next.delete(post.id);
                return next;
            });
        }
    };

    return (
        <DashboardLayout>
            <div className="max-w-2xl mx-auto space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Posts</h1>
                    <p className="text-slate-500 dark:text-slate-400">Share updates and announcements</p>
                </div>

                {/* Create Post Form */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
                    <form onSubmit={handleCreatePost} className="space-y-4">
                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shrink-0">
                                <User size={20} className="text-white" />
                            </div>
                            <div className="flex-1">
                                <textarea
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    placeholder="What's on your mind?"
                                    rows="3"
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:bg-white dark:focus:bg-slate-600 focus:border-blue-500 transition-all resize-none"
                                />
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="relative flex-1">
                                <Image size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="url"
                                    value={imageUrl}
                                    onChange={(e) => setImageUrl(e.target.value)}
                                    placeholder="Image URL (optional)"
                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-500 transition-all"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={submitting || !content.trim()}
                                className="btn-primary px-6 py-2.5 rounded-xl text-sm disabled:opacity-50"
                            >
                                {submitting ? (
                                    <Loader2 size={18} className="animate-spin" />
                                ) : (
                                    <Send size={18} />
                                )}
                                Post
                            </button>
                        </div>
                    </form>
                </div>

                {/* Posts Feed */}
                {loading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 animate-pulse">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-700" />
                                    <div className="flex-1">
                                        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/3 mb-2" />
                                        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/4" />
                                    </div>
                                </div>
                                <div className="h-16 bg-slate-200 dark:bg-slate-700 rounded w-full" />
                            </div>
                        ))}
                    </div>
                ) : posts.length === 0 ? (
                    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-12 text-center">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-600/10 flex items-center justify-center mx-auto mb-4">
                            <MessageSquare size={40} className="text-blue-500" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">No Posts Yet</h2>
                        <p className="text-slate-500 dark:text-slate-400">Create the first post to get started!</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {posts.map((post) => (
                            <div
                                key={post.id}
                                className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 hover:shadow-lg transition-all"
                            >
                                {/* Post Header */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shrink-0">
                                            <span className="text-lg font-bold text-white">
                                                {post.fullName?.charAt(0) || "U"}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-800 dark:text-white">{post.fullName || "User"}</p>
                                            <p className="text-xs text-slate-400 flex items-center gap-1">
                                                <Clock size={12} />
                                                {post.createdAt ? new Date(post.createdAt).toLocaleString() : "Just now"}
                                            </p>
                                        </div>
                                    </div>
                                    {user?.id === post.userId && (
                                        <button
                                            onClick={() => handleDeletePost(post.id)}
                                            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                                            title="Delete"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    )}
                                </div>

                                {/* Post Content */}
                                <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap mb-4">
                                    {post.content}
                                </p>

                                {/* Post Image */}
                                {post.imageUrl && (
                                    <img
                                        src={post.imageUrl}
                                        alt="Post attachment"
                                        className="w-full rounded-xl object-cover max-h-96 mb-4 border border-slate-200 dark:border-slate-700"
                                        onError={(e) => {
                                            e.target.style.display = "none";
                                        }}
                                    />
                                )}

                                {/* Post Actions */}
                                <div className="flex items-center gap-4 pt-3 border-t border-slate-100 dark:border-slate-700">
                                    <button
                                        onClick={() => handleLikeToggle(post)}
                                        disabled={likingPosts.has(post.id)}
                                        className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition ${
                                            post.likedByUser
                                                ? "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400"
                                                : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700"
                                        }`}
                                    >
                                        {likingPosts.has(post.id) ? (
                                            <Loader2 size={16} className="animate-spin" />
                                        ) : (
                                            <Heart
                                                size={16}
                                                className={post.likedByUser ? "fill-red-500" : ""}
                                            />
                                        )}
                                        {post.likeCount || 0}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
