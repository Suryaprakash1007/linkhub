import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { createTag, updateTag } from "../../services/tagService";
import { X, Hash, Loader2 } from "lucide-react";

export default function CreateTagModal({ isOpen, onClose, onSuccess, editTag }) {
    const [isLoading, setIsLoading] = useState(false);
    const { register, handleSubmit, reset } = useForm();

    useEffect(() => {
        if (editTag) {
            reset({ name: editTag.name, description: editTag.description });
        } else {
            reset({ name: "", description: "" });
        }
    }, [editTag, reset]);

    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            if (editTag) {
                await updateTag(editTag.id, data);
                toast.success("Tag updated successfully");
            } else {
                await createTag(data);
                toast.success("Tag created successfully");
            }
            onSuccess();
            onClose();
        } catch (error) {
            toast.error(error.response?.data?.message || "Operation failed");
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
                        <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                            <Hash size={20} className="text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                                {editTag ? "Edit Tag" : "Create Tag"}
                            </h2>
                            <p className="text-sm text-slate-500">
                                {editTag ? "Update tag details" : "Add a new tag"}
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
                            Tag Name
                        </label>
                        <input
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:bg-white dark:focus:bg-slate-600 focus:border-green-500 transition-all"
                            placeholder="Java, React, College..."
                            {...register("name", { required: "Name is required" })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                            Description
                        </label>
                        <textarea
                            rows="3"
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:bg-white dark:focus:bg-slate-600 focus:border-green-500 transition-all"
                            placeholder="Optional description..."
                            {...register("description")}
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
                        <button type="button" onClick={onClose} className="btn-secondary px-5 py-3 rounded-xl text-sm">
                            Cancel
                        </button>
                        <button type="submit" disabled={isLoading} className="btn-primary px-6 py-3 rounded-xl text-sm disabled:opacity-60">
                            {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Hash size={18} />}
                            {editTag ? "Update Tag" : "Create Tag"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
