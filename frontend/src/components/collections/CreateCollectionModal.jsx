import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { createCollection, updateCollection } from "../../services/collectionService";
import { X, FolderKanban, Loader2 } from "lucide-react";

export default function CreateCollectionModal({ isOpen, onClose, onSuccess, editCollection }) {
    const [isLoading, setIsLoading] = useState(false);
    const { register, handleSubmit, reset } = useForm();

    useEffect(() => {
        if (editCollection) {
            reset({ name: editCollection.name, description: editCollection.description });
        } else {
            reset({ name: "", description: "" });
        }
    }, [editCollection, reset]);

    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            if (editCollection) {
                await updateCollection(editCollection.id, data);
                toast.success("Collection updated");
            } else {
                await createCollection(data);
                toast.success("Collection created");
            }
            onSuccess();
            onClose();
        } catch (error) {
            toast.error("Operation failed");
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md p-6 md:p-8 animate-scaleIn">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                            <FolderKanban size={20} className="text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                                {editCollection ? "Edit Collection" : "Create Collection"}
                            </h2>
                            <p className="text-sm text-slate-500">
                                {editCollection ? "Update collection details" : "Add a new collection"}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                            Collection Name
                        </label>
                        <input
                            placeholder="e.g. Resources, Bookmarks"
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:bg-white dark:focus:bg-slate-600 focus:border-emerald-500 transition-all"
                            {...register("name", { required: "Name is required" })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                            Description
                        </label>
                        <textarea
                            rows="3"
                            placeholder="Optional description..."
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:bg-white dark:focus:bg-slate-600 focus:border-emerald-500 transition-all"
                            {...register("description")}
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
                        <button type="button" onClick={onClose} className="btn-secondary px-5 py-3 rounded-xl text-sm">
                            Cancel
                        </button>
                        <button type="submit" disabled={isLoading} className="btn-primary px-6 py-3 rounded-xl text-sm disabled:opacity-60">
                            {isLoading ? <Loader2 size={18} className="animate-spin" /> : <FolderKanban size={18} />}
                            {editCollection ? "Update" : "Create"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
