import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { getCategories, deleteCategory } from "../../services/categoryService";
import CreateCategoryModal from "../../components/categories/CreateCategoryModal";
import toast from "react-hot-toast";
import { Pencil, Trash2, FolderTree, Plus, Search, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Categories() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openModal, setOpenModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [search, setSearch] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await getCategories();
            setCategories(response);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this category?")) return;
        try {
            await deleteCategory(id);
            toast.success("Category deleted");
            fetchCategories();
        } catch (error) {
            toast.error("Delete failed");
        }
    };

    const handleEdit = (category) => {
        setEditingCategory(category);
        setOpenModal(true);
    };

    const filtered = categories.filter((c) =>
        c.name?.toLowerCase().includes(search.toLowerCase())
    );

    const SkeletonCard = () => (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 animate-pulse">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-700" />
                <div className="flex-1 space-y-2">
                    <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-1/3" />
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/4" />
                </div>
            </div>
        </div>
    );

    const colors = [
        "from-blue-500 to-blue-600",
        "from-purple-500 to-purple-600",
        "from-emerald-500 to-emerald-600",
        "from-rose-500 to-rose-600",
        "from-amber-500 to-amber-600",
        "from-cyan-500 to-cyan-600",
    ];

    return (
        <DashboardLayout>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Categories</h1>
                    <p className="text-slate-500 dark:text-slate-400">Organize your links into categories</p>
                </div>
                <button
                    onClick={() => {
                        setEditingCategory(null);
                        setOpenModal(true);
                    }}
                    className="btn-primary px-5 py-3 rounded-xl text-sm flex items-center gap-2"
                >
                    <Plus size={18} />
                    Create Category
                </button>
            </div>

            {loading ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3, 4, 5, 6].map((i) => <SkeletonCard key={i} />)}
                </div>
            ) : filtered.length === 0 ? (
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-12 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center mx-auto mb-4">
                        <FolderTree size={32} className="text-violet-600 dark:text-violet-400" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">No Categories Yet</h2>
                    <p className="text-slate-500 dark:text-slate-400 mb-6">Create your first category to organize your links.</p>
                    <button onClick={() => setOpenModal(true)} className="btn-primary px-6 py-3 rounded-xl text-sm">
                        <Plus size={18} /> Create Category
                    </button>
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {filtered.map((category, index) => (
                        <div
                            key={category.id}
                            className="group bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
                            onClick={() => navigate(`/categories/${category.id}`)}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <div
                                        className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colors[index % colors.length]} flex items-center justify-center shadow-lg`}
                                    >
                                        <FolderTree size={20} className="text-white" />
                                    </div>
                                    <div>
                                        <h2 className="font-bold text-slate-800 dark:text-white">{category.name}</h2>
                                        <p className="text-sm text-slate-500">{category.totalLinks || 0} Links</p>
                                    </div>
                                </div>
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleEdit(category);
                                        }}
                                        className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-blue-50 dark:hover:bg-blue-900/20 text-slate-400 hover:text-blue-600 transition"
                                    >
                                        <Pencil size={16} />
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete(category.id);
                                        }}
                                        className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-400 hover:text-red-600 transition"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>

                            {/* Link count bar */}
                            <div className="mt-4 flex items-center gap-2">
                                <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                    <div
                                        className="h-full rounded-full bg-gradient-to-r from-violet-500 to-purple-600 transition-all"
                                        style={{ width: `${Math.min((category.totalLinks || 0) / 20 * 100, 100)}%` }}
                                    />
                                </div>
                                <span className="text-xs text-slate-400 font-medium">{category.totalLinks || 0}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <CreateCategoryModal
                isOpen={openModal}
                onClose={() => {
                    setOpenModal(false);
                    setEditingCategory(null);
                }}
                onSuccess={fetchCategories}
                editCategory={editingCategory}
            />
        </DashboardLayout>
    );
}

