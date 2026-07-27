import { useState } from "react";
import { useForm } from "react-hook-form";
import { registerUser } from "../../services/authService";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { UserPlus, Mail, Lock, User, Eye, EyeOff, Loader2, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);
    const [registeredEmail, setRegisteredEmail] = useState("");

    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors }
    } = useForm();

    const password = watch("password");

    const getPasswordStrength = (pwd) => {
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

    const pwdStrength = getPasswordStrength(password);

    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            await registerUser({
                fullName: data.fullName,
                email: data.email,
                password: data.password
            });
            setRegisteredEmail(data.email);
            setEmailSent(true);
            toast.success("Account created! Please check your email. 📧");
        } catch (error) {
            toast.error(error.response?.data?.message || "Registration failed");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Animated background shapes */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: "1s" }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse" style={{ animationDelay: "2s" }} />
            </div>

            <div className="relative w-full max-w-md animate-fadeIn">

                {/* ── Email Sent Success Screen ── */}
                {emailSent ? (
                    <div className="glass rounded-2xl p-8 md:p-10 shadow-2xl text-center">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-emerald-100 shadow-lg mb-6">
                            <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900 mb-2">Check your inbox! 📧</h1>
                        <p className="text-slate-600 mb-2">We've sent a verification link to:</p>
                        <p className="font-semibold text-blue-600 mb-6 break-all">{registeredEmail}</p>
                        <p className="text-slate-500 text-sm mb-8">
                            Click the link in that email to verify your account. The link expires in <strong>24 hours</strong>.
                        </p>
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-left">
                            <p className="text-xs text-amber-700">
                                <strong>📌 Tip:</strong> Check your Spam / Junk folder if you don't see it in your inbox within a few minutes.
                            </p>
                        </div>
                        <button
                            onClick={() => navigate("/login")}
                            className="btn-primary w-full py-3.5 rounded-xl text-base font-semibold"
                        >
                            Go to Login
                        </button>
                        <p className="mt-4 text-sm text-slate-500">
                            Wrong email?{" "}
                            <button
                                onClick={() => { setEmailSent(false); setRegisteredEmail(""); }}
                                className="font-semibold text-blue-600 hover:text-blue-700 transition"
                            >
                                Register again
                            </button>
                        </p>
                    </div>
                ) : (
                    /* ── Registration Form ── */
                    <div className="glass rounded-2xl p-8 md:p-10 shadow-2xl">
                        {/* Logo / Brand */}
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-primary shadow-lg mb-4">
                                <UserPlus className="w-8 h-8 text-white" />
                            </div>
                            <h1 className="text-3xl font-bold text-slate-900">Create Account</h1>
                            <p className="text-slate-500 mt-2">Join LinkHub today</p>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            {/* Full Name */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                        <User className="h-5 w-5 text-slate-400" />
                                    </div>
                                    <input
                                        placeholder="John Doe"
                                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:bg-white transition-all"
                                        {...register("fullName", {
                                            required: "Full Name is required",
                                            minLength: { value: 2, message: "Minimum 2 characters" }
                                        })}
                                    />
                                </div>
                                {errors.fullName && (
                                    <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                                        {errors.fullName.message}
                                    </p>
                                )}
                            </div>

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

                            {/* Password */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-slate-400" />
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Create a strong password"
                                        className="w-full pl-11 pr-12 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:bg-white transition-all"
                                        {...register("password", {
                                            required: "Password is required",
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
                                {/* Password Strength Indicator */}
                                {password && (
                                    <div className="mt-2">
                                        <div className="flex gap-1">
                                            {[1, 2, 3, 4, 5].map((i) => (
                                                <div
                                                    key={i}
                                                    className={`h-1.5 flex-1 rounded-full transition-all ${
                                                        i <= pwdStrength.level ? pwdStrength.color : "bg-slate-200"
                                                    }`}
                                                />
                                            ))}
                                        </div>
                                        <p className="text-xs text-slate-500 mt-1">Strength: {pwdStrength.label}</p>
                                    </div>
                                )}
                                {errors.password && (
                                    <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                                        {errors.password.message}
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
                                        placeholder="Confirm your password"
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

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="btn-primary w-full py-3.5 rounded-xl text-base font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Creating account...
                                    </span>
                                ) : (
                                    <span className="flex items-center justify-center gap-2">
                                        <UserPlus className="w-5 h-5" />
                                        Create Account
                                    </span>
                                )}
                            </button>
                        </form>

                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-slate-200"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-slate-500 rounded-full">Or continue with</span>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => window.location.href = `${import.meta.env.VITE_API_BASE_URL || 'https://linkhub-uc2w.onrender.com'}/oauth2/authorization/google`}
                            className="w-full py-3 bg-white border-2 border-slate-200 rounded-xl text-slate-700 font-semibold hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center gap-3 shadow-sm"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            Google
                        </button>                        {/* Login Link */}
                        <p className="mt-6 text-center text-sm text-slate-500">
                            Already have an account?{" "}
                            <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-700 transition">
                                Sign in
                            </Link>
                        </p>
                    </div>
                )}

                {/* Footer */}
                <p className="text-center text-slate-400 text-xs mt-6">
                    &copy; 2024 LinkHub. All rights reserved.
                </p>
            </div>
        </div>
    );
}
