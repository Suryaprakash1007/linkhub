import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

export default function OAuth2RedirectHandler() {
    const location = useLocation();
    const navigate = useNavigate();
    const { login } = useAuth();

    useEffect(() => {
        const getUrlParameter = (name) => {
            name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
            const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
            const results = regex.exec(location.search);
            return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
        };

        const token = getUrlParameter('token');
        const error = getUrlParameter('error');

        if (token) {
            // Log the user in
            login({ token });
            toast.success("Successfully logged in with Google! 🎉");
            navigate("/dashboard");
        } else {
            toast.error(error || "Google login failed. Please try again.");
            navigate("/login");
        }
    }, [location, navigate, login]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
            <div className="glass rounded-2xl p-8 md:p-10 shadow-2xl flex flex-col items-center justify-center space-y-4">
                <Loader2 className="w-12 h-12 text-white animate-spin" />
                <h2 className="text-xl font-bold text-white">Authenticating with Google...</h2>
                <p className="text-slate-300 text-sm">Please wait while we log you in securely.</p>
            </div>
        </div>
    );
}
