import { useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { resetPassword } from "../../services/authService";
import toast from "react-hot-toast";
import {
    Lock, Eye, EyeOff, ShieldCheck, Loader2,
    KeyRound, CheckCircle2
} from "lucide-react";

export default function ResetPassword() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get("token");

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [done, setDone] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors }
    } = useForm();

    const password = watch("newPassword");

    // Password strength
    const getStrength = (pwd) => {
        if (!pwd) return { level: 0, label: "", color: "" };
        let score = 0;
        if (pwd.length >= 6) score++;
        if (pwd.length >= 10) score++;
        if (/[A-Z]/.test(pwd)) score++;
        if (/[0-9]/.test(pwd)) score++;
        if (/[^A-Za-z0-9]/.test(pwd)) score++;
        const levels = [
            { level: 1, label: "Weak", color: "bg-red-500" },
            { level: 2, label: "Fair", color: "bg-orange-500" },
            { level: 3, label: "Good", color: "bg-yellow-500" },
            { level: 4, label: "Strong", color: "bg-green-500" },
            { level: 5, label: "Very Strong", color: "bg-emerald-500" },
        ];
        return levels[Math.min(score, 5) - 1] || { level: 0, label: "", color: "" };
    };

    const strength = getStrength(password);

    const onSubmit = async (data) => {
        if (!token) {
            toast.error("No reset token found. Please use the link from your email.");
            return;
        }

        setIsLoading(true);
        try {
            await resetPassword({
                token,
                newPassword: data.newPassword,
                confirmPassword: data.confirmPassword
            });
            setDone(true);
            toast.success("Password reset successfully! 🎉");
        } catch (err) {
            toast.error(err.response?.data?.message || "Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Animated blobs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-amber-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-red-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: "1s" }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse" style={{ animationDelay: "2s" }} />
            </div>

            <div className="relative w-full max-w-md animate-fadeIn">
                <div className="glass rounded-2xl p-8 md:p-10 shadow-2xl">

                    {/* Done state */}
                    {done ? (
                        <div className="text-center">
                            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-emerald-100 shadow-lg mb-6">
                                <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                            </div>
                            <h1 className="text-2xl font-bold text-slate-900 mb-2">Password Updated! 🎉</h1>
                            <p className="text-slate-600 mb-8">
                                Your password has been reset successfully. You can now log in with your new password.
                            </p>
                            <button
                                onClick={() => navigate("/login")}
                                className="btn-primary w-full py-3.5 rounded-xl text-base font-semibold"
                            >
                                Go to Login
                            </button>
                        </div>
                    ) : (
                        <>
                            {/* Header */}
                            <div className="text-center mb-8">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-primary shadow-lg mb-4"
                                     style={{ background: "linear-gradient(135deg, #f59e0b, #ef4444)" }}>
                                    <KeyRound className="w-8 h-8 text-white" />
                                </div>
                                <h1 className="text-3xl font-bold text-slate-900">Reset Password</h1>
                                <p className="text-slate-500 mt-2">Choose a strong new password</p>
                            </div>

                            {!token && (
                                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm text-center">
                                    ⚠️ Invalid reset link. Please use the link from your email.
                                </div>
                            )}

                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                                {/* New Password */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">New Password</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                            <Lock className="h-5 w-5 text-slate-400" />
                                        </div>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Create a strong password"
                                            className="w-full pl-11 pr-12 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:bg-white transition-all"
                                            {...register("newPassword", {
                                                required: "New password is required",
                                                minLength: { value: 6, message: "Minimum 6 characters" },
                                                pattern: {
                                                    value: /^(?=.*[A-Za-z])(?=.*\d)/,
                                                    message: "Must contain letter and number"
                                                }
                                            })}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition"
                                        >
                                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                        </button>
                                    </div>
                                    {/* Strength meter */}
                                    {password && (
                                        <div className="mt-2">
                                            <div className="flex gap-1">
                                                {[1, 2, 3, 4, 5].map((i) => (
                                                    <div
                                                        key={i}
                                                        className={`h-1.5 flex-1 rounded-full transition-all ${i <= strength.level ? strength.color : "bg-slate-200"}`}
                                                    />
                                                ))}
                                            </div>
                                            <p className="text-xs text-slate-500 mt-1">Strength: {strength.label}</p>
                                        </div>
                                    )}
                                    {errors.newPassword && (
                                        <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1">
                                            <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                                            {errors.newPassword.message}
                                        </p>
                                    )}
                                </div>

                                {/* Confirm Password */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Confirm Password</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                            <ShieldCheck className="h-5 w-5 text-slate-400" />
                                        </div>
                                        <input
                                            type={showConfirm ? "text" : "password"}
                                            placeholder="Confirm your new password"
                                            className="w-full pl-11 pr-12 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:bg-white transition-all"
                                            {...register("confirmPassword", {
                                                required: "Please confirm your password",
                                                validate: value => value === password || "Passwords do not match"
                                            })}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirm(!showConfirm)}
                                            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition"
                                        >
                                            {showConfirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                        </button>
                                    </div>
                                    {errors.confirmPassword && (
                                        <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1">
                                            <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                                            {errors.confirmPassword.message}
                                        </p>
                                    )}
                                </div>

                                {/* Submit */}
                                <button
                                    type="submit"
                                    disabled={isLoading || !token}
                                    className="btn-primary w-full py-3.5 rounded-xl text-base font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Resetting…
                                        </span>
                                    ) : (
                                        <span className="flex items-center justify-center gap-2">
                                            <KeyRound className="w-5 h-5" />
                                            Reset Password
                                        </span>
                                    )}
                                </button>
                            </form>

                            <p className="mt-6 text-center text-sm text-slate-500">
                                Remember your password?{" "}
                                <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-700 transition">
                                    Sign in
                                </Link>
                            </p>
                        </>
                    )}
                </div>
                <p className="text-center text-slate-400 text-xs mt-6">
                    &copy; 2024 LinkHub. All rights reserved.
                </p>
            </div>
        </div>
    );
}
