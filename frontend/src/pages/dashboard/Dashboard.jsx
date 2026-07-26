import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import StatCard from "../../components/dashboard/StatCard";
import { getDashboard } from "../../services/dashboardService";
import { getMyLinks } from "../../services/linkService";
import {
    Link2,
    MousePointerClick,
    Activity,
    AlertTriangle,
    Heart,
    Pin,
    ExternalLink,
    Plus,
    ArrowRight,
    TrendingUp,
    TrendingDown,
    Sparkles
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function Dashboard() {
    const [dashboard, setDashboard] = useState(null);
    const [recentLinks, setRecentLinks] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        Promise.all([fetchDashboard(), fetchRecentLinks()]);
    }, []);

    const fetchDashboard = async () => {
        try {
            const response = await getDashboard();
            setDashboard(response);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchRecentLinks = async () => {
        try {
            const response = await getMyLinks(0);
            setRecentLinks(response?.content?.slice(0, 5) || []);
        } catch (error) {
            console.error(error);
        }
    };

    const stats = dashboard
        ? [
              {
                  title: "Total Links",
                  value: dashboard.totalLinks,
                  icon: Link2,
                  color: "from-blue-600 to-blue-700",
                  bgColor: "bg-blue-50 dark:bg-blue-900/20",
                  textColor: "text-blue-600 dark:text-blue-400",
                  trend: "+12%",
                  trendUp: true,
              },
              {
                  title: "Total Clicks",
                  value: dashboard.totalClicks,
                  icon: MousePointerClick,
                  color: "from-emerald-600 to-emerald-700",
                  bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
                  textColor: "text-emerald-600 dark:text-emerald-400",
                  trend: "+28%",
                  trendUp: true,
              },
              {
                  title: "Active Links",
                  value: dashboard.activeLinks,
                  icon: Activity,
                  color: "from-cyan-600 to-cyan-700",
                  bgColor: "bg-cyan-50 dark:bg-cyan-900/20",
                  textColor: "text-cyan-600 dark:text-cyan-400",
                  trend: "Active",
                  trendUp: true,
              },
              {
                  title: "Expired Links",
                  value: dashboard.expiredLinks,
                  icon: AlertTriangle,
                  color: "from-red-600 to-red-700",
                  bgColor: "bg-red-50 dark:bg-red-900/20",
                  textColor: "text-red-600 dark:text-red-400",
                  trend: dashboard.expiredLinks > 0 ? "Needs attention" : "None",
                  trendUp: false,
              },
              {
                  title: "Favorites",
                  value: dashboard.favoriteLinks,
                  icon: Heart,
                  color: "from-pink-600 to-pink-700",
                  bgColor: "bg-pink-50 dark:bg-pink-900/20",
                  textColor: "text-pink-600 dark:text-pink-400",
                  trend: "Saved",
                  trendUp: true,
              },
              {
                  title: "Pinned",
                  value: dashboard.pinnedLinks,
                  icon: Pin,
                  color: "from-amber-600 to-amber-700",
                  bgColor: "bg-amber-50 dark:bg-amber-900/20",
                  textColor: "text-amber-600 dark:text-amber-400",
                  trend: "Priority",
                  trendUp: true,
              },
          ]
        : [];

    if (loading) {
        return (
            <DashboardLayout>
                <div className="space-y-6 animate-pulse">
                    <div className="h-32 bg-slate-200 dark:bg-slate-700 rounded-2xl" />
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="h-32 bg-slate-200 dark:bg-slate-700 rounded-2xl" />
                        ))}
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            {/* Welcome Banner */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-6 md:p-8 mb-8">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
                <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 text-blue-200 mb-2">
                            <Sparkles size={20} />
                            <span className="text-sm font-medium">Welcome back!</span>
                        </div>
                        <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">
                            Your Links Dashboard
                        </h1>
                        <p className="text-blue-200 text-sm md:text-base">
                            Here's what's happening with your links today.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => navigate("/links")}
                            className="flex items-center gap-2 px-5 py-2.5 bg-white/15 backdrop-blur-sm text-white rounded-xl hover:bg-white/25 transition-all text-sm font-medium border border-white/10"
                        >
                            View All Links
                            <ArrowRight size={16} />
                        </button>
                        <button
                            onClick={() => navigate("/links")}
                            className="flex items-center gap-2 px-5 py-2.5 bg-white text-blue-700 rounded-xl hover:bg-blue-50 transition-all text-sm font-medium shadow-lg"
                        >
                            <Plus size={16} />
                            Create Link
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={stat.title}
                            className="group relative bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                        >
                            <div className="flex items-start justify-between">
                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-slate-400 dark:text-slate-500">
                                        {stat.title}
                                    </p>
                                    <p className="text-3xl font-bold text-slate-800 dark:text-white">
                                        {stat.value}
                                    </p>
                                    <div className="flex items-center gap-1.5">
                                        {stat.trendUp ? (
                                            <TrendingUp size={14} className="text-emerald-500" />
                                        ) : (
                                            <TrendingDown size={14} className="text-red-500" />
                                        )}
                                        <span
                                            className={`text-xs font-medium ${
                                                stat.trendUp
                                                    ? "text-emerald-500"
                                                    : "text-red-500"
                                            }`}
                                        >
                                            {stat.trend}
                                        </span>
                                    </div>
                                </div>
                                <div
                                    className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center ${stat.textColor}`}
                                >
                                    <Icon size={24} />
                                </div>
                            </div>
                            {/* Progress Bar */}
                            <div className="mt-4 h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full bg-gradient-to-r ${stat.color} transition-all duration-500`}
                                    style={{
                                        width: `${Math.min(
                                            (stat.value /
                                                (dashboard.totalLinks || 1)) *
                                                100,
                                            100
                                        )}%`,
                                    }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Bottom Row: Most Clicked + Recent Links */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* Most Clicked Link Card */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold text-slate-800 dark:text-white">
                            🔥 Most Clicked Link
                        </h2>
                        <ExternalLink
                            size={20}
                            className="text-slate-300 dark:text-slate-600"
                        />
                    </div>
                    <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl border border-amber-100 dark:border-amber-800/30">
                        <p className="text-lg font-semibold text-slate-800 dark:text-white">
                            {dashboard?.mostClickedTitle || "No links available"}
                        </p>
                        <div className="flex items-center gap-2 mt-3">
                            <MousePointerClick
                                size={18}
                                className="text-amber-500"
                            />
                            <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                                {dashboard?.mostClickedCount || 0}
                            </span>
                            <span className="text-sm text-slate-400">total clicks</span>
                        </div>
                    </div>
                </div>

                {/* Recent Links */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold text-slate-800 dark:text-white">
                            📋 Recent Links
                        </h2>
                        <Link
                            to="/links"
                            className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                        >
                            View All
                            <ArrowRight size={14} />
                        </Link>
                    </div>
                    {recentLinks.length === 0 ? (
                        <div className="text-center py-8 text-slate-400">
                            <p>No links created yet</p>
                            <button
                                onClick={() => navigate("/links")}
                                className="mt-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
                            >
                                Create your first link
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {recentLinks.map((link) => (
                                <div
                                    key={link.id}
                                    className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition cursor-pointer"
                                    onClick={() => navigate("/links")}
                                >
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">
                                            {link.title || "Untitled"}
                                        </p>
                                        <p className="text-xs text-slate-400 truncate">
                                            {link.shortUrl}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2 ml-3">
                                        <span className="text-xs text-slate-400">
                                            {link.clickCount} clicks
                                        </span>
                                        <span
                                            className={`w-2 h-2 rounded-full ${
                                                link.isActive
                                                    ? "bg-emerald-500"
                                                    : "bg-red-500"
                                            }`}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}

