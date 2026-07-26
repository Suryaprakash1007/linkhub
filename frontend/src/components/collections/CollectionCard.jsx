import { FolderOpen, Pencil, Trash2, FolderKanban } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { deleteCollection } from "../../services/collectionService";
import toast from "react-hot-toast";

export default function CollectionCard({ collection, onRefresh, onEdit }) {
    const navigate = useNavigate();

    const handleDelete = async () => {
        if (!window.confirm("Delete this collection?")) return;
        try {
            await deleteCollection(collection.id);
            toast.success("Collection deleted");
            onRefresh();
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete collection");
        }
    };

    return (
        <div className="group bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300">
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center shadow-lg shrink-0">
                        <FolderKanban className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h3
                            onClick={() => navigate(`/collections/${collection.id}`)}
                            className="text-lg font-bold text-slate-800 dark:text-white cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition"
                        >
                            {collection.name}
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                            {collection.description || "No description"}
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-sm font-medium">
                    {collection.totalLinks} Links
                </span>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={() => navigate(`/collections/${collection.id}`)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition"
                        title="Open"
                    >
                        <FolderOpen size={16} />
                    </button>
                    <button
                        onClick={() => onEdit(collection)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition"
                        title="Edit"
                    >
                        <Pencil size={16} />
                    </button>
                    <button
                        onClick={handleDelete}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                        title="Delete"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
}
