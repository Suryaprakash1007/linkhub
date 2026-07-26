import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { createCategory, updateCategory } from "../../services/categoryService";
import { X, FolderTree, Loader2 } from "lucide-react";

export default function CreateCategoryModal({ isOpen, onClose, onSuccess, editCategory }) {
    const [isLoading, setIsLoading] = useState(false);
    const { register, handleSubmit, reset } = useForm();

    useEffect(() => {
        if (editCategory) {
            reset({ name: editCategory.name });
        } else {
            reset({ name: "" });
        }
    }, [editCategory, reset]);

    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            if (editCategory) {
                await updateCategory(editCategory.id, data);
                toast.success("Category updated");
            } else {
                await createCategory(data);
                toast.success("Category created");
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
                        <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                            <FolderTree size={20} className="text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                                {editCategory ? "Edit Category" : "Create Category"}
                            </h2>
                            <p className="text-sm text-slate-500">
                                {editCategory ? "Update category name" : "Add a new category"}
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
                            Category Name
                        </label>
                        <input
                            placeholder="e.g. Work, Personal, Study"
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:bg-white dark:focus:bg-slate-600 focus:border-purple-500 transition-all"
                            {...register("name", { required: "Name is required" })}
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
                        <button type="button" onClick={onClose} className="btn-secondary px-5 py-3 rounded-xl text-sm">
                            Cancel
                        </button>
                        <button type="submit" disabled={isLoading} className="btn-primary px-6 py-3 rounded-xl text-sm disabled:opacity-60">
                            {isLoading ? <Loader2 size={18} className="animate-spin" /> : <FolderTree size={18} />}
                            {editCategory ? "Update" : "Create"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
