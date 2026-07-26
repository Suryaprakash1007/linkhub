import { useEffect, useState, useRef } from "react";
import api from "../../api/axios";
import { Link, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import useAuth from "../../hooks/useAuth";
import {
    Bell,
    Search,
    Sun,
    Moon,
    LogOut,
    User,
    Settings,
    ChevronRight,
    Home
} from "lucide-react";

export default function Navbar() {
    const [profile, setProfile] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
const [darkMode, setDarkMode] = useState(() => {
        const stored = localStorage.getItem("darkMode");
        if (stored !== null) return stored === "true";
        return window.matchMedia("(prefers-color-scheme: dark)").matches;
    });
    const [notifications, setNotifications] = useState(3);
    const dropdownRef = useRef(null);
    const { logout } = useAuth();
    const location = useLocation();

useEffect(() => {
        fetchProfile();
    }, []);

    // Apply dark mode class on mount
    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [darkMode]);

    useEffect(() => {
        function handleClickOutside(e) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setShowDropdown(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await api.get("/api/auth/me");
            setProfile(response.data);
        } catch (error) {
            console.error("Failed to load profile");
        }
    };

    const name = profile?.fullName || "User";
    const firstLetter = name.charAt(0).toUpperCase();

    // Generate breadcrumbs from path
    const pathParts = location.pathname.split("/").filter(Boolean);
    const breadcrumbs = pathParts.map((part, index) => ({
        label: part.charAt(0).toUpperCase() + part.slice(1).replace(/-/g, " "),
        path: "/" + pathParts.slice(0, index + 1).join("/"),
        isLast: index === pathParts.length - 1,
    }));

const toggleDarkMode = () => {
        const newMode = !darkMode;
        setDarkMode(newMode);
        localStorage.setItem("darkMode", newMode);
        document.documentElement.classList.toggle("dark");
    };

    return (
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-4 md:px-6 sticky top-0 z-30">
            {/* Left: Breadcrumb + Search */}
            <div className="flex items-center gap-4 flex-1">
                {/* Breadcrumb Navigation */}
                <nav className="hidden md:flex items-center gap-1.5 text-sm">
                    <Link
                        to="/dashboard"
                        className="text-slate-400 hover:text-blue-600 transition"
                    >
                        <Home size={16} />
                    </Link>
                    {breadcrumbs.map((crumb) => (
                        <span key={crumb.path} className="flex items-center gap-1.5">
                            <ChevronRight size={14} className="text-slate-300" />
                            {crumb.isLast ? (
                                <span className="font-medium text-slate-800 dark:text-slate-200">
                                    {crumb.label}
                                </span>
                            ) : (
                                <Link
                                    to={crumb.path}
                                    className="text-slate-500 hover:text-blue-600 transition"
                                >
                                    {crumb.label}
                                </Link>
                            )}
                        </span>
                    ))}
                </nav>


            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2 md:gap-3">
                {/* Dark Mode Toggle */}
                <button
                    onClick={toggleDarkMode}
                    className="relative w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-yellow-500 dark:hover:text-yellow-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                    title={darkMode ? "Light Mode" : "Dark Mode"}
                >
                    {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                </button>

                {/* Notification Bell */}
                <div className="relative">
                    <button 
                        onClick={() => {
                            setNotifications(0);
                            toast.success("Notifications cleared");
                        }}
                        className="relative w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                        title="Notifications"
                    >
                        <Bell size={18} />
                        {notifications > 0 && (
                            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center shadow-lg">
                                {notifications}
                            </span>
                        )}
                    </button>
                </div>

                {/* Profile Dropdown */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setShowDropdown(!showDropdown)}
                        className="flex items-center gap-2 md:gap-3 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                    >
                        <div className="hidden md:block text-right">
                            <p className="text-sm font-medium text-slate-800 dark:text-slate-200 leading-tight">
                                {name}
                            </p>
                            <p className="text-xs text-slate-400 truncate max-w-[120px]">
                                {profile?.email || ""}
                            </p>
                        </div>
                        <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center text-white text-sm font-bold shadow-md overflow-hidden">
                            {profile?.profilePicture ? (
                                <img src={profile.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                firstLetter
                            )}
                        </div>
                    </button>

                    {/* Dropdown Menu */}
                    {showDropdown && (
                        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 py-2 animate-scaleIn origin-top-right z-50">
                            {/* User Info Header */}
                            <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700">
                                <p className="font-medium text-slate-800 dark:text-slate-200">{name}</p>
                                <p className="text-sm text-slate-400 truncate">{profile?.email}</p>
                            </div>

                            <div className="py-1">
                                <Link
                                    to="/profile"
                                    onClick={() => setShowDropdown(false)}
                                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-blue-600 transition"
                                >
                                    <User size={18} />
                                    Profile
                                </Link>
                                <Link
                                    to="/profile"
                                    onClick={() => setShowDropdown(false)}
                                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-blue-600 transition"
                                >
                                    <Settings size={18} />
                                    Settings
                                </Link>
                            </div>

                            <div className="border-t border-slate-100 dark:border-slate-700 py-1">
                                <button
                                    onClick={() => {
                                        setShowDropdown(false);
                                        logout();
                                    }}
                                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 w-full transition"
                                >
                                    <LogOut size={18} />
                                    Logout
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}

