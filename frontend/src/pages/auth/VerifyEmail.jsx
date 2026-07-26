import { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { verifyEmail } from "../../services/authService";
import { CheckCircle2, XCircle, Loader2, LogIn } from "lucide-react";

export default function VerifyEmail() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get("token");

    const [status, setStatus] = useState("loading"); // loading | success | error
    const [message, setMessage] = useState("");
    const hasFetched = useRef(false);

    useEffect(() => {
        if (!token) {
            setStatus("error");
            setMessage("No verification token found in the link.");
            return;
        }

        if (hasFetched.current) return;
        hasFetched.current = true;

        const doVerify = async () => {
            try {
                const res = await verifyEmail(token);
                setMessage(res.message || "Email verified successfully!");
                setStatus("success");
            } catch (err) {
                setMessage(
                    err.response?.data?.message ||
                    "The verification link is invalid or has expired."
                );
                setStatus("error");
            }
        };

        doVerify();
    }, [token]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Animated blobs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: "1s" }} />
            </div>

            <div className="relative w-full max-w-md animate-fadeIn">
                <div className="glass rounded-2xl p-8 md:p-10 shadow-2xl text-center">

                    {/* Loading */}
                    {status === "loading" && (
                        <>
                            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl gradient-primary shadow-lg mb-6">
                                <Loader2 className="w-10 h-10 text-white animate-spin" />
                            </div>
                            <h1 className="text-2xl font-bold text-slate-900 mb-2">Verifying your email…</h1>
                            <p className="text-slate-500">Please wait a moment.</p>
                        </>
                    )}

                    {/* Success */}
                    {status === "success" && (
                        <>
                            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-emerald-100 shadow-lg mb-6">
                                <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                            </div>
                            <h1 className="text-2xl font-bold text-slate-900 mb-2">Email Verified! 🎉</h1>
                            <p className="text-slate-600 mb-8">{message}</p>
                            <button
                                onClick={() => navigate("/login")}
                                className="btn-primary w-full py-3.5 rounded-xl text-base font-semibold flex items-center justify-center gap-2"
                            >
                                <LogIn className="w-5 h-5" />
                                Go to Login
                            </button>
                        </>
                    )}

                    {/* Error */}
                    {status === "error" && (
                        <>
                            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-red-100 shadow-lg mb-6">
                                <XCircle className="w-10 h-10 text-red-500" />
                            </div>
                            <h1 className="text-2xl font-bold text-slate-900 mb-2">Verification Failed</h1>
                            <p className="text-slate-600 mb-8">{message}</p>
                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={() => navigate("/register")}
                                    className="btn-primary w-full py-3.5 rounded-xl text-base font-semibold"
                                >
                                    Register Again
                                </button>
                                <Link
                                    to="/login"
                                    className="text-sm text-blue-600 hover:text-blue-700 font-medium transition"
                                >
                                    Back to Login
                                </Link>
                            </div>
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
