import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { createLink, updateLink } from "../../services/linkService";
import { aiService } from "../../services/aiService";
import {
    X,
    Link2,
    Loader2,
    CalendarClock,
    Lock,
    Eye,
    EyeOff,
    Sparkles
} from "lucide-react";

export default function CreateLinkModal({
    isOpen,
    onClose,
    onSuccess,
    editLink
}) {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isAiLoading, setIsAiLoading] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        getValues,
        setValue,
        formState: { errors },
    } = useForm();

    useEffect(() => {
        if (editLink) {
            reset({
                originalUrl: editLink.originalUrl,
                title: editLink.title,
                customAlias: editLink.customAlias,
                notes: editLink.notes,
                description: editLink.description || "",
                expirationDate: editLink.expirationDate
                    ? editLink.expirationDate.split("T")[0]
                    : "",
                password: "",
            });
        } else {
            reset({
                originalUrl: "",
                title: "",
                customAlias: "",
                notes: "",
                description: "",
                expirationDate: "",
                password: "",
            });
        }
    }, [editLink, reset]);

    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            const payload = {
                originalUrl: data.originalUrl,
                title: data.title,
                customAlias: data.customAlias || undefined,
                notes: data.notes,
                description: data.description,
                expirationDate: data.expirationDate
                    ? new Date(data.expirationDate).toISOString()
                    : null,
                password: data.password || undefined,
            };

            if (editLink) {
                await updateLink(editLink.id, payload);
                toast.success("Link updated successfully! 🎉");
            } else {
                await createLink(payload);
                toast.success("Link created successfully! 🎉");
            }

            await onSuccess();
            reset();
            onClose();
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Operation failed"
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleAutoFill = async () => {
        const url = getValues("originalUrl");
        if (!url || !url.startsWith("http")) {
            toast.error("Please enter a valid URL first");
            return;
        }
        
        setIsAiLoading(true);
        try {
            const suggestion = await aiService.suggestMetadata(url);
            if (suggestion.title) setValue("title", suggestion.title);
            if (suggestion.description) setValue("description", suggestion.description);
            if (suggestion.category) {
                const currentNotes = getValues("notes") || "";
                setValue("notes", currentNotes ? `${currentNotes}\nAI Category: ${suggestion.category}` : `AI Category: ${suggestion.category}`);
            }
            toast.success("AI Autofill complete! ✨");
        } catch (error) {
            toast.error("Failed to generate AI suggestions");
        } finally {
            setIsAiLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 md:p-8 animate-scaleIn">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-lg">
                            <Link2 className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                                {editLink ? "Edit Link" : "Create New Link"}
                            </h2>
                            <p className="text-sm text-slate-500">
                                {editLink
                                    ? "Update your shortened link details"
                                    : "Shorten a new URL"}
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

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Original URL */}
                    <div>
                        <div className="flex items-center justify-between mb-1.5">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                Original URL <span className="text-red-500">*</span>
                            </label>
                            <button
                                type="button"
                                onClick={handleAutoFill}
                                disabled={isAiLoading}
                                className="flex items-center gap-1.5 text-xs font-medium text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/30 px-2.5 py-1 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/50 transition disabled:opacity-50"
                            >
                                {isAiLoading ? (
                                    <Loader2 size={14} className="animate-spin" />
                                ) : (
                                    <Sparkles size={14} />
                                )}
                                Auto-Fill ✨
                            </button>
                        </div>
                        <input
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:bg-white dark:focus:bg-slate-600 focus:border-blue-500 transition-all"
                            placeholder="https://example.com/long-url"
                            {...register("originalUrl", {
                                required: "URL is required",
                                pattern: {
                                    value: /^https?:\/\/.+/,
                                    message: "Must start with http:// or https://",
                                },
                            })}
                        />
                        {errors.originalUrl && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.originalUrl.message}
                            </p>
                        )}
                    </div>

                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                            Title
                        </label>
                        <input
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:bg-white dark:focus:bg-slate-600 focus:border-blue-500 transition-all"
                            placeholder="My Awesome Link"
                            {...register("title")}
                        />
                    </div>

                    {/* Custom Alias */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                            Custom Alias
                        </label>
                        <input
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:bg-white dark:focus:bg-slate-600 focus:border-blue-500 transition-all"
                            placeholder="my-custom-alias"
                            {...register("customAlias")}
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                            Description
                        </label>
                        <textarea
                            rows="2"
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:bg-white dark:focus:bg-slate-600 focus:border-blue-500 transition-all"
                            placeholder="Optional description"
                            {...register("description")}
                        />
                    </div>

                    {/* Notes */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                            Notes
                        </label>
                        <textarea
                            rows="2"
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:bg-white dark:focus:bg-slate-600 focus:border-blue-500 transition-all"
                            placeholder="Internal notes"
                            {...register("notes")}
                        />
                    </div>

                    {/* Expiry Date */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                            <div className="flex items-center gap-2">
                                <CalendarClock size={16} className="text-slate-400" />
                                Expiration Date
                            </div>
                        </label>
                        <input
                            type="date"
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-600 focus:border-blue-500 transition-all"
                            {...register("expirationDate")}
                        />
                    </div>

                    {/* Password */}
                    {!editLink && (
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                <div className="flex items-center gap-2">
                                    <Lock size={16} className="text-slate-400" />
                                    Password Protection
                                </div>
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="w-full pl-4 pr-12 py-3 bg-slate-50 dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:bg-white dark:focus:bg-slate-600 focus:border-blue-500 transition-all"
                                    placeholder="Optional password"
                                    {...register("password", {
                                        minLength: {
                                            value: 4,
                                            message: "Minimum 4 characters",
                                        },
                                    })}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-500">
                                    {errors.password.message}
                                </p>
                            )}
                        </div>
                    )}

                    {/* Buttons */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn-secondary px-5 py-3 rounded-xl text-sm"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="btn-primary px-6 py-3 rounded-xl text-sm disabled:opacity-60"
                        >
                            {isLoading ? (
                                <Loader2 size={18} className="animate-spin" />
                            ) : (
                                <Link2 size={18} />
                            )}
                            {editLink ? "Update Link" : "Create Link"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

