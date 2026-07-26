import { useState } from "react";
import { useForm } from "react-hook-form";
import { X, Lock, Eye, EyeOff, Loader2, ShieldCheck } from "lucide-react";
import api from "../../api/axios";
import toast from "react-hot-toast";

export default function PasswordModal({ isOpen, onClose, linkId, onSuccess }) {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            await api.put(`/api/links/${linkId}/password`, {
                password: data.password,
            });
            toast.success("Password set successfully!");
            reset();
            onSuccess?.();
            onClose();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to set password");
        } finally {
            setIsLoading(false);
        }
    };

    const handleRemovePassword = async () => {
        if (!window.confirm("Remove password protection from this link?")) return;
        setIsLoading(true);
        try {
            await api.delete(`/api/links/${linkId}/password`);
            toast.success("Password removed!");
            onSuccess?.();
            onClose();
        } catch (error) {
            toast.error("Failed to remove password");
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
                        <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                            <Lock size={20} className="text-amber-600 dark:text-amber-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-800 dark:text-white">Password Protection</h2>
                            <p className="text-sm text-slate-500">Set a password for this link</p>
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
                            Password
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                <Lock size={18} className="text-slate-400" />
                            </div>
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter a password for this link"
                                className="w-full pl-11 pr-12 py-3 bg-slate-50 dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:bg-white dark:focus:bg-slate-600 focus:border-amber-500 transition-all"
                                {...register("password", {
                                    required: "Password is required",
                                    minLength: { value: 4, message: "Minimum 4 characters" },
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
                            <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="btn-primary flex-1 py-3 rounded-xl text-sm disabled:opacity-60"
                        >
                            {isLoading ? (
                                <Loader2 size={18} className="animate-spin" />
                            ) : (
                                <ShieldCheck size={18} />
                            )}
                            Set Password
                        </button>
                        <button
                            type="button"
                            onClick={handleRemovePassword}
                            disabled={isLoading}
                            className="btn-secondary px-4 py-3 rounded-xl text-sm text-red-600 border-red-200 hover:bg-red-50"
                        >
                            Remove
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

