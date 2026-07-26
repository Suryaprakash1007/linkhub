import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import {
    getLinks,
    getHistory,
    getAnalytics
} from "../../services/analyticsService";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Legend
} from "recharts";
import {
    MousePointerClick,
    Monitor,
    Smartphone,
    Globe,
    ExternalLink,
    CalendarClock,
    Activity,
    BarChart3,
    TrendingUp,
    Loader2
} from "lucide-react";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

export default function Analytics() {
    const [links, setLinks] = useState([]);
    const [selected, setSelected] = useState("");
    const [history, setHistory] = useState([]);
    const [analytics, setAnalytics] = useState(null);
    const [loadingLinks, setLoadingLinks] = useState(true);
    const [loadingAnalytics, setLoadingAnalytics] = useState(false);
    const [tab, setTab] = useState("overview");

    useEffect(() => {
        loadLinks();
    }, []);

    const loadLinks = async () => {
        setLoadingLinks(true);
        try {
            const data = await getLinks();
            setLinks(data?.content || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingLinks(false);
        }
    };

    const loadHistory = async (id) => {
        if (!id) {
            setSelected("");
            setAnalytics(null);
            setHistory([]);
            return;
        }
        setSelected(id);
        setLoadingAnalytics(true);
        try {
            const [historyData, analyticsData] = await Promise.all([
                getHistory(id),
                getAnalytics(id)
            ]);
            setHistory(historyData);
            setAnalytics(analyticsData);
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingAnalytics(false);
        }
    };

    const browserData = analytics
        ? [
              { name: "Chrome", value: analytics.chromeClicks || 0, color: "#3b82f6" },
              { name: "Edge", value: analytics.edgeClicks || 0, color: "#10b981" },
              { name: "Firefox", value: analytics.firefoxClicks || 0, color: "#f59e0b" },
              { name: "Safari", value: analytics.safariClicks || 0, color: "#8b5cf6" },
              { name: "Other", value: analytics.otherBrowserClicks || 0, color: "#ef4444" }
          ].filter(d => d.value > 0)
        : [];

    const deviceData = analytics
        ? [
              { name: "Desktop", value: analytics.desktopClicks || 0 },
              { name: "Mobile", value: analytics.mobileClicks || 0 },
              { name: "Tablet", value: analytics.tabletClicks || 0 }
          ].filter(d => d.value > 0)
        : [];

    const osData = analytics
        ? [
              { name: "Windows", value: analytics.windowsClicks || 0 },
              { name: "macOS", value: analytics.macClicks || 0 },
              { name: "Linux", value: analytics.linuxClicks || 0 },
              { name: "Android", value: analytics.androidClicks || 0 },
              { name: "iOS", value: analytics.iosClicks || 0 },
              { name: "Other", value: analytics.otherOsClicks || 0 }
          ].filter(d => d.value > 0)
        : [];

    const statCards = analytics
        ? [
              {
                  label: "Total Clicks",
                  value: analytics.totalClicks,
                  icon: MousePointerClick,
                  color: "blue",
                  change: "+12%"
              },
              {
                  label: "Desktop",
                  value: analytics.desktopClicks,
                  icon: Monitor,
                  color: "violet",
                  change: "+8%"
              },
              {
                  label: "Mobile",
                  value: analytics.mobileClicks,
                  icon: Smartphone,
                  color: "emerald",
                  change: "+15%"
              },
              {
                  label: "Browsers Used",
                  value: browserData.length,
icon: Globe,
                  color: "amber",
                  change: "-"
              }
          ]
        : [];

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white dark:bg-slate-800 p-3 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700">
                    <p className="text-sm font-semibold text-slate-800 dark:text-white">
                        {payload[0].name}
                    </p>
                    <p className="text-lg font-bold text-blue-600">
                        {payload[0].value} clicks
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <DashboardLayout>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Analytics</h1>
                    <p className="text-slate-500 dark:text-slate-400">Track link performance and click insights</p>
                </div>
            </div>

            {/* Link Selector */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 mb-6">
                <div className="flex flex-col md:flex-row gap-3">
                    <div className="relative flex-1">
                        <ExternalLink size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <select
                            value={selected}
                            onChange={(e) => loadHistory(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-sm text-slate-700 dark:text-slate-300 focus:border-blue-500 transition-all appearance-none cursor-pointer"
                        >
                            <option value="">Select a link to analyze...</option>
                            {links.map(link => (
                                <option key={link.id} value={link.id}>
                                    {link.title || link.shortCode || link.id}
                                </option>
                            ))}
                        </select>
                    </div>
                    {selected && (
                        <div className="flex gap-2">
                            <button
                                onClick={() => setTab("overview")}
                                className={`px-4 py-2.5 rounded-xl text-sm font-medium transition ${
                                    tab === "overview"
                                        ? "bg-blue-600 text-white"
                                        : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
                                }`}
                            >
                                <Activity size={16} className="inline mr-1" />
                                Overview
                            </button>
                            <button
                                onClick={() => setTab("details")}
                                className={`px-4 py-2.5 rounded-xl text-sm font-medium transition ${
                                    tab === "details"
                                        ? "bg-blue-600 text-white"
                                        : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
                                }`}
                            >
                                <CalendarClock size={16} className="inline mr-1" />
                                History
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {!selected ? (
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-12 text-center">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-600/10 flex items-center justify-center mx-auto mb-4">
                        <BarChart3 size={40} className="text-blue-500" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">
                        Select a Link to Analyze
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                        Choose a shortened link from the dropdown above to view detailed analytics including click trends, browser distribution, and device breakdown.
                    </p>
                    {loadingLinks && (
                        <div className="flex items-center justify-center gap-2 mt-4 text-slate-400">
                            <Loader2 size={16} className="animate-spin" />
                            Loading links...
                        </div>
                    )}
                </div>
            ) : loadingAnalytics ? (
                <div className="space-y-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 animate-pulse">
                                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2 mb-3" />
                                <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/3" />
                            </div>
                        ))}
                    </div>
                    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 animate-pulse">
                        <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-1/4 mb-6" />
                        <div className="h-[300px] bg-slate-200 dark:bg-slate-700 rounded" />
                    </div>
                </div>
            ) : (
                <>
                    {/* Tab: Overview */}
                    {tab === "overview" && (
                        <>
                            {/* Stat Cards */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                {statCards.map((card) => {
                                    const Icon = card.icon;
                                    return (
                                        <div
                                            key={card.label}
                                            className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 hover:shadow-lg transition-all"
                                        >
                                            <div className="flex items-center justify-between mb-3">
                                                <div className={`w-10 h-10 rounded-xl bg-${card.color}-100 dark:bg-${card.color}-900/30 flex items-center justify-center`}>
                                                    <Icon size={20} className={`text-${card.color}-600 dark:text-${card.color}-400`} />
                                                </div>
                                                {card.change !== "-" && (
                                                    <span className="inline-flex items-center gap-0.5 text-xs font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded-full">
                                                        <TrendingUp size={12} />
                                                        {card.change}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">{card.label}</p>
                                            <p className="text-2xl font-bold text-slate-800 dark:text-white mt-1">{card.value}</p>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                                {/* Browser Distribution Pie */}
                                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
                                    <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                                        <Globe size={20} className="text-blue-500" />
                                        Browser Distribution
                                    </h2>
                                    {browserData.length > 0 ? (
                                        <ResponsiveContainer width="100%" height={280}>
                                            <PieChart>
                                                <Pie
                                                    data={browserData}
                                                    dataKey="value"
                                                    nameKey="name"
                                                    cx="50%"
                                                    cy="50%"
                                                    outerRadius={100}
                                                    innerRadius={50}
                                                    paddingAngle={4}
                                                >
                                                    {browserData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <Tooltip content={<CustomTooltip />} />
                                                <Legend
                                                    verticalAlign="bottom"
                                                    height={36}
                                                    formatter={(value) => (
                                                        <span className="text-sm text-slate-600 dark:text-slate-400">{value}</span>
                                                    )}
                                                />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    ) : (
                                        <div className="h-[280px] flex items-center justify-center text-slate-400">
                                            No browser data available
                                        </div>
                                    )}
                                </div>

                                {/* Device Distribution */}
                                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
                                    <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                                        <Smartphone size={20} className="text-emerald-500" />
                                        Device Distribution
                                    </h2>
                                    {deviceData.length > 0 ? (
                                        <ResponsiveContainer width="100%" height={280}>
                                            <BarChart data={deviceData}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                                <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                                <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                                <Tooltip content={<CustomTooltip />} />
                                                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                                                    {deviceData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    ) : (
                                        <div className="h-[280px] flex items-center justify-center text-slate-400">
                                            No device data available
                                        </div>
                                    )}
                                </div>

                                {/* OS Distribution Bar */}
                                {osData.length > 0 && (
                                    <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
                                        <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                                            <Monitor size={20} className="text-violet-500" />
                                            Operating System Distribution
                                        </h2>
                                        <ResponsiveContainer width="100%" height={250}>
                                            <BarChart data={osData} layout="vertical">
                                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                                <XAxis type="number" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                                <YAxis dataKey="name" type="category" tick={{ fill: '#94a3b8', fontSize: 12 }} width={80} />
                                                <Tooltip content={<CustomTooltip />} />
                                                <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                                                    {osData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                )}
                            </div>
                        </>
                    )}

                    {/* Tab: Click History */}
                    {tab === "details" && (
                        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                            <div className="p-6 border-b border-slate-100 dark:border-slate-700">
                                <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                    <CalendarClock size={20} className="text-blue-500" />
                                    Click History
                                </h2>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-slate-50 dark:bg-slate-700/50">
                                            <th className="p-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Time</th>
                                            <th className="p-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Browser</th>
                                            <th className="p-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">OS</th>
                                            <th className="p-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Device</th>
                                            <th className="p-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">IP</th>
                                            <th className="p-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Referrer</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                        {history.length === 0 ? (
                                            <tr>
                                                <td colSpan="6" className="p-8 text-center text-slate-500">
                                                    No click history found for this link.
                                                </td>
                                            </tr>
                                        ) : (
                                            history.map((item, index) => (
                                                <tr key={index} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition">
                                                    <td className="p-4 text-sm text-slate-700 dark:text-slate-300 whitespace-nowrap">
                                                        <span className="inline-flex items-center gap-1.5">
                                                            <CalendarClock size={14} className="text-slate-400" />
                                                            {new Date(item.clickedAt).toLocaleString()}
                                                        </span>
                                                    </td>
                                                    <td className="p-4 text-sm text-slate-700 dark:text-slate-300">
                                                        <span className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs font-medium">
                                                            {item.browser || "-"}
                                                        </span>
                                                    </td>
                                                    <td className="p-4 text-sm text-slate-700 dark:text-slate-300">{item.operatingSystem || "-"}</td>
                                                    <td className="p-4 text-sm text-slate-700 dark:text-slate-300">
                                                        <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${
                                                            item.deviceType === "Mobile"
                                                                ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300"
                                                                : "bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300"
                                                        }`}>
                                                            {item.deviceType || "-"}
                                                        </span>
                                                    </td>
                                                    <td className="p-4 text-sm text-slate-500 dark:text-slate-400 font-mono">{item.ipAddress || "-"}</td>
                                                    <td className="p-4 text-sm text-slate-500 dark:text-slate-400">{item.referrer || "-"}</td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </>
            )}
        </DashboardLayout>
    );
}
