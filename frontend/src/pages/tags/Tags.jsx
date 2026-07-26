import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { getTags, deleteTag } from "../../services/tagService";
import CreateTagModal from "../../components/tags/CreateTagModal";
import toast from "react-hot-toast";
import { Pencil, Trash2, Tags as TagsIcon, Plus, Search, Hash } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function TagsPage() {
    const [tags, setTags] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openModal, setOpenModal] = useState(false);
    const [editingTag, setEditingTag] = useState(null);
    const [search, setSearch] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetchTags();
    }, []);

    const fetchTags = async () => {
        try {
            const response = await getTags();
            setTags(response);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this tag?")) return;
        try {
            await deleteTag(id);
            toast.success("Tag deleted");
            fetchTags();
        } catch {
            toast.error("Delete failed");
        }
    };

    const handleEdit = (tag) => {
        setEditingTag(tag);
        setOpenModal(true);
    };

    const filtered = tags.filter(
        (t) =>
            t.name?.toLowerCase().includes(search.toLowerCase()) ||
            t.description?.toLowerCase().includes(search.toLowerCase())
    );

    const SkeletonCard = () => (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 animate-pulse">
            <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-slate-200 dark:bg-slate-700" />
                <div className="flex-1 space-y-2">
                    <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-1/3" />
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
                </div>
            </div>
        </div>
    );

    return (
        <DashboardLayout>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Tags</h1>
                    <p className="text-slate-500 dark:text-slate-400">Organize your links with tags</p>
                </div>
                <button
                    onClick={() => {
                        setEditingTag(null);
                        setOpenModal(true);
                    }}
                    className="btn-primary px-5 py-3 rounded-xl text-sm flex items-center gap-2"
                >
                    <Plus size={18} />
                    Create Tag
                </button>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <SkeletonCard key={i} />
                    ))}
                </div>
            ) : filtered.length === 0 ? (
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-12 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center mx-auto mb-4">
                        <Hash size={32} className="text-slate-400" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">
                        {search ? "No tags found" : "No Tags Yet"}
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 mb-6">
                        {search ? "Try a different search term" : "Create your first tag to organize links."}
                    </p>
                    {!search && (
                        <button
                            onClick={() => setOpenModal(true)}
                            className="btn-primary px-6 py-3 rounded-xl text-sm"
                        >
                            <Plus size={18} />
                            Create Your First Tag
                        </button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filtered.map((tag) => (
                        <div
                            key={tag.id}
                            onClick={() => navigate(`/tags/${tag.id}`)}
                            className="group bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center shadow-lg shrink-0">
                                        <Hash className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                                            {tag.name}
                                        </h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                                            {tag.description || "No description"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-sm font-medium">
                                    <TagsIcon size={14} />
                                    {tag.totalLinks || 0} Links
                                </span>
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleEdit(tag);
                                        }}
                                        className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition"
                                    >
                                        <Pencil size={16} />
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete(tag.id);
                                        }}
                                        className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <CreateTagModal
                isOpen={openModal}
                onClose={() => {
                    setOpenModal(false);
                    setEditingTag(null);
                }}
                onSuccess={fetchTags}
                editTag={editingTag}
            />
        </DashboardLayout>
    );
}
