import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import api from "../../api/axios";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import {
    User,
    Mail,
    MapPin,
    Building2,
    GraduationCap,
    BookOpen,
    Save,
    X,
    Camera,
    Key,
    Eye,
    EyeOff,
    Loader2,
    ShieldCheck,
    BarChart3,
    Link2,
    MousePointerClick,
    Activity,
    ExternalLink
} from "lucide-react";

export default function Profile() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [stats, setStats] = useState(null);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm();

    useEffect(() => {
        fetchProfile();
        fetchStats();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await api.get("/api/auth/me");
            setProfile(response.data);
            reset(response.data);
        } catch (error) {
            toast.error("Failed to load profile");
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await api.get("/api/links/dashboard");
            setStats(response.data);
        } catch {
            // Stats are optional
        }
    };

    const onSubmit = async (data) => {
        try {
            const response = await api.put("/api/auth/me", data);
            setProfile(response.data);
            reset(response.data); // Reset form state with new data
            setEditing(false);
            toast.success("Profile updated successfully!");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update profile");
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            toast.error("Image size should be less than 5MB");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        setUploadingImage(true);
        try {
            const response = await api.post("/api/auth/me/profile-picture", formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
            setProfile(response.data);
            toast.success("Profile picture updated!");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to upload image");
        } finally {
            setUploadingImage(false);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }
        if (passwordData.newPassword.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }
        setPasswordLoading(true);
        try {
            await api.put("/api/auth/change-password", {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword,
            });
            toast.success("Password changed successfully!");
            setShowPasswordForm(false);
            setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to change password");
        } finally {
            setPasswordLoading(false);
        }
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div className="max-w-4xl mx-auto animate-pulse space-y-6">
                    <div className="h-48 bg-slate-200 dark:bg-slate-700 rounded-2xl" />
                    <div className="h-64 bg-slate-200 dark:bg-slate-700 rounded-2xl" />
                </div>
            </DashboardLayout>
        );
    }

    const statItems = stats ? [
        { label: "Total Links", value: stats.totalLinks, icon: Link2, color: "blue" },
        { label: "Total Clicks", value: stats.totalClicks, icon: MousePointerClick, color: "emerald" },
        { label: "Active", value: stats.activeLinks, icon: Activity, color: "cyan" },
        { label: "Favorites", value: stats.favoriteLinks, icon: BarChart3, color: "pink" },
    ] : [];

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Cover Photo Area */}
                <div className="relative h-48 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800">
                    <div className="absolute inset-0 overflow-hidden rounded-2xl">
                        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzR2LTRoNHY0aC00em0wIDB2LTRoNHY0aC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
                    </div>
                    <div className="absolute -bottom-12 left-8 z-20">
                        <div className="relative">
                            <div className="w-28 h-28 rounded-2xl bg-white dark:bg-slate-800 p-1.5 shadow-2xl">
                                <div className="w-full h-full rounded-xl gradient-primary flex items-center justify-center overflow-hidden">
                                    {profile?.profilePicture ? (
                                        <img src={profile.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-4xl font-bold text-white">
                                            {profile?.fullName?.charAt(0) || "U"}
                                        </span>
                                    )}
                                </div>
                            </div>
                            
                            <label htmlFor="profile-upload" className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-white dark:bg-slate-700 shadow-md flex items-center justify-center text-slate-500 hover:text-blue-600 transition cursor-pointer z-10">
                                {uploadingImage ? <Loader2 size={16} className="animate-spin" /> : <Camera size={16} className="pointer-events-none" />}
                                <input 
                                    id="profile-upload"
                                    type="file" 
                                    accept="image/*" 
                                    className="sr-only" 
                                    onChange={handleImageUpload}
                                    disabled={uploadingImage}
                                />
                            </label>
                        </div>
                    </div>
                </div>

                {/* Profile Info Section */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 md:p-8">
                    <div className="flex items-center justify-between mb-6 pt-2 md:pt-0 md:ml-36">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
                                {profile?.fullName || "User"}
                            </h1>
                            <p className="text-slate-500 dark:text-slate-400">{profile?.email}</p>
                            <p className="text-blue-600 dark:text-blue-400 font-medium">@{profile?.username}</p>
                        </div>
                        <div className="flex gap-3">
                            <a
                                href={`/u/${profile?.username}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-secondary px-5 py-2.5 rounded-xl text-sm inline-flex items-center gap-2"
                            >
                                <ExternalLink size={16} />
                                View Profile
                            </a>
                            {!editing && (
                                <button
                                    onClick={() => setEditing(true)}
                                    className="btn-primary px-5 py-2.5 rounded-xl text-sm"
                                >
                                    Edit Profile
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Stats Cards */}
                    {statItems.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            {statItems.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <div
                                        key={item.label}
                                        className="p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-700"
                                    >
                                        <div className="flex items-center gap-2 mb-2">
                                            <Icon size={16} className={`text-${item.color}-500`} />
                                            <span className="text-xs text-slate-500 dark:text-slate-400">
                                                {item.label}
                                            </span>
                                        </div>
                                        <p className="text-2xl font-bold text-slate-800 dark:text-white">
                                            {item.value}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Edit Form */}
                    {editing ? (
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                        Full Name
                                    </label>
                                    <div className="relative">
                                        <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="text"
                                            className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-600 focus:border-blue-500 transition-all"
                                            {...register("fullName", { required: "Name is required" })}
                                        />
                                    </div>
                                    {errors.fullName && (
                                        <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                        Username
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">@</span>
                                        <input
                                            type="text"
                                            className="w-full pl-8 pr-4 py-3 bg-slate-50 dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-600 focus:border-blue-500 transition-all"
                                            {...register("username", { 
                                                required: "Username is required",
                                                pattern: {
                                                    value: /^[a-zA-Z0-9]+$/,
                                                    message: "Username can only contain letters and numbers"
                                                }
                                            })}
                                        />
                                    </div>
                                    {errors.username && (
                                        <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                        College
                                    </label>
                                    <div className="relative">
                                        <GraduationCap size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="text"
                                            className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-600 focus:border-blue-500 transition-all"
                                            {...register("college")}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                        Department
                                    </label>
                                    <div className="relative">
                                        <BookOpen size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="text"
                                            className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-600 focus:border-blue-500 transition-all"
                                            {...register("department")}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                        Location
                                    </label>
                                    <div className="relative">
                                        <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="text"
                                            className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-600 focus:border-blue-500 transition-all"
                                            {...register("location")}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                        Bio
                                    </label>
                                    <textarea
                                        rows="1"
                                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-600 focus:border-blue-500 transition-all"
                                        {...register("bio")}
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button type="submit" className="btn-primary px-6 py-3 rounded-xl text-sm">
                                    <Save size={18} />
                                    Save Changes
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setEditing(false);
                                        reset(profile);
                                    }}
                                    className="btn-secondary px-6 py-3 rounded-xl text-sm"
                                >
                                    <X size={18} />
                                    Cancel
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50">
                                <label className="text-xs text-slate-400 uppercase tracking-wider">Bio</label>
                                <p className="text-slate-700 dark:text-slate-300 mt-1">
                                    {profile?.bio || "No bio added yet"}
                                </p>
                            </div>
                            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50">
                                <label className="text-xs text-slate-400 uppercase tracking-wider">College</label>
                                <p className="text-slate-700 dark:text-slate-300 mt-1">
                                    {profile?.college || "Not specified"}
                                </p>
                            </div>
                            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50">
                                <label className="text-xs text-slate-400 uppercase tracking-wider">Department</label>
                                <p className="text-slate-700 dark:text-slate-300 mt-1">
                                    {profile?.department || "Not specified"}
                                </p>
                            </div>
                            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50">
                                <label className="text-xs text-slate-400 uppercase tracking-wider">Location</label>
                                <p className="text-slate-700 dark:text-slate-300 mt-1">
                                    {profile?.location || "Not specified"}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Change Password Section */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 md:p-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                                <Key size={20} className="text-amber-600 dark:text-amber-400" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-slate-800 dark:text-white">Password</h2>
                                <p className="text-sm text-slate-500">Change your account password</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowPasswordForm(!showPasswordForm)}
                            className="btn-secondary px-4 py-2.5 rounded-xl text-sm"
                        >
                            {showPasswordForm ? "Cancel" : "Change Password"}
                        </button>
                    </div>

                    {showPasswordForm && (
                        <form onSubmit={handlePasswordChange} className="mt-6 space-y-4 border-t border-slate-100 dark:border-slate-700 pt-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                        Current Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showCurrent ? "text" : "password"}
                                            className="w-full pl-4 pr-12 py-3 bg-slate-50 dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-600 focus:border-blue-500 transition-all"
                                            value={passwordData.currentPassword}
                                            onChange={(e) =>
                                                setPasswordData({ ...passwordData, currentPassword: e.target.value })
                                            }
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowCurrent(!showCurrent)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                        >
                                            {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                        New Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showNew ? "text" : "password"}
                                            className="w-full pl-4 pr-12 py-3 bg-slate-50 dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-600 focus:border-blue-500 transition-all"
                                            value={passwordData.newPassword}
                                            onChange={(e) =>
                                                setPasswordData({ ...passwordData, newPassword: e.target.value })
                                            }
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowNew(!showNew)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                        >
                                            {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                        Confirm New Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showConfirm ? "text" : "password"}
                                            className="w-full pl-4 pr-12 py-3 bg-slate-50 dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-600 focus:border-blue-500 transition-all"
                                            value={passwordData.confirmPassword}
                                            onChange={(e) =>
                                                setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                                            }
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirm(!showConfirm)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                        >
                                            {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={passwordLoading}
                                    className="btn-primary px-6 py-3 rounded-xl text-sm disabled:opacity-60"
                                >
                                    {passwordLoading ? (
                                        <Loader2 size={18} className="animate-spin" />
                                    ) : (
                                        <ShieldCheck size={18} />
                                    )}
                                    Update Password
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}

