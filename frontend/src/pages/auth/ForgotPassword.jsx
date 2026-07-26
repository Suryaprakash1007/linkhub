import { useState } from "react";
import { useForm } from "react-hook-form";
import { forgotPassword } from "../../services/authService";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Mail, ArrowLeft, Loader2, Send } from "lucide-react";

export default function ForgotPassword() {
    const [isLoading, setIsLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();

    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            await forgotPassword(data);
            setSent(true);
            toast.success("If the email exists, a reset link has been sent.");
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Animated background shapes */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: "1s" }} />
            </div>

            {/* Forgot Password Card */}
            <div className="relative w-full max-w-md animate-fadeIn">
                <div className="glass rounded-2xl p-8 md:p-10 shadow-2xl">
                    {/* Back Button */}
                    <button
                        onClick={() => navigate("/login")}
                        className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition mb-6"
                    >
                        <ArrowLeft size={16} />
                        Back to Login
                    </button>

                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-primary shadow-lg mb-4">
                            <Mail className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-slate-900">Forgot Password</h1>
                        <p className="text-slate-500 mt-2">
                            {sent
                                ? "Check your email for the reset link"
                                : "Enter your email and we'll send you a reset link"}
                        </p>
                    </div>

                    {!sent ? (
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-slate-400" />
                                    </div>
                                    <input
                                        type="email"
                                        placeholder="you@example.com"
                                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:bg-white transition-all"
                                        {...register("email", {
                                            required: "Email is required",
                                            pattern: {
                                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                message: "Invalid email address"
                                            }
                                        })}
                                    />
                                </div>
                                {errors.email && (
                                    <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                                        {errors.email.message}
                                    </p>
                                )}
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="btn-primary w-full py-3.5 rounded-xl text-base font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Sending...
                                    </span>
                                ) : (
                                    <span className="flex items-center justify-center gap-2">
                                        <Send className="w-5 h-5" />
                                        Send Reset Link
                                    </span>
                                )}
                            </button>
                        </form>
                    ) : (
                        <div className="text-center">
                            <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                                <Mail className="w-8 h-8 text-emerald-600" />
                            </div>
                            <p className="text-slate-600 mb-6">
                                We've sent a password reset link to your email. Please check your inbox.
                            </p>
                            <button
                                onClick={() => navigate("/login")}
                                className="btn-primary px-6 py-3 rounded-xl text-sm"
                            >
                                Back to Login
                            </button>
                        </div>
                    )}

                    {/* Register Link */}
                    <p className="mt-6 text-center text-sm text-slate-500">
                        Don&apos;t have an account?{" "}
                        <Link to="/register" className="font-semibold text-blue-600 hover:text-blue-700 transition">
                            Create one
                        </Link>
                    </p>
                </div>

                <p className="text-center text-slate-400 text-xs mt-6">
                    &copy; 2024 LinkHub. All rights reserved.
                </p>
            </div>
        </div>
    );
}

