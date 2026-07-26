import { useState } from "react";
import {
    LayoutDashboard,
    Link2,
    FolderOpen,
    Tags,
    BarChart3,
    User,
    LogOut,
    FolderKanban,
    FolderTree,
    Menu,
    X,
    ChevronLeft,
    ChevronRight,
    MessageSquare
} from "lucide-react";
import { NavLink } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

export default function Sidebar() {
    const [collapsed, setCollapsed] = useState(false);
    const { logout } = useAuth();

    const menu = [
        { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
        { name: "My Links", icon: Link2, path: "/links" },
        { name: "Posts", icon: MessageSquare, path: "/posts" },
        { name: "Collections", icon: FolderKanban, path: "/collections" },
        { name: "Categories", icon: FolderTree, path: "/categories" },
        { name: "Tags", icon: Tags, path: "/tags" },
        { name: "Analytics", icon: BarChart3, path: "/analytics" },
        { name: "Profile", icon: User, path: "/profile" },
    ];

    return (
        <>
            {/* Mobile overlay */}
            <div
                className={`fixed inset-0 bg-black/50 z-40 transition-opacity lg:hidden ${
                    collapsed ? "opacity-0 pointer-events-none" : "opacity-100"
                }`}
                onClick={() => setCollapsed(true)}
            />

            <aside
                className={`fixed lg:static inset-y-0 left-0 z-50 flex flex-col transition-all duration-300 ease-in-out ${
                    collapsed ? "-translate-x-full lg:translate-x-0 lg:w-20" : "translate-x-0 w-64"
                } bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 text-white shadow-2xl`}
            >
                {/* Header */}
                <div className="relative p-5 border-b border-slate-700/50">
                    {/* Mobile close button */}
                    <button
                        onClick={() => setCollapsed(true)}
                        className="absolute top-4 right-4 lg:hidden text-slate-400 hover:text-white transition"
                    >
                        <X size={20} />
                    </button>

                    {!collapsed ? (
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-lg">
                                <Link2 className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold tracking-tight">LinkHub</h1>
                                <p className="text-slate-400 text-xs">Smart Link Management</p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex justify-center">
                            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-lg">
                                <Link2 className="w-5 h-5 text-white" />
                            </div>
                        </div>
                    )}
                </div>

                {/* Toggle button (desktop) */}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="hidden lg:flex absolute -right-3 top-20 w-6 h-6 rounded-full bg-slate-800 border border-slate-600 items-center justify-center text-slate-400 hover:text-white hover:border-blue-500 transition z-10"
                >
                    {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                </button>

                {/* Navigation */}
                <nav className="flex-1 p-3 space-y-1 overflow-y-auto scrollbar-thin">
                    {menu.map((item) => {
                        const Icon = item.icon;
                        return (
                            <NavLink
                                key={item.name}
                                to={item.path}
                                onClick={() => {
                                    if (window.innerWidth < 1024) setCollapsed(true);
                                }}
                                className={({ isActive }) =>
                                    `group relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                                        isActive
                                            ? "bg-gradient-to-r from-blue-600/20 to-blue-700/10 text-blue-400 border-l-2 border-blue-500"
                                            : "text-slate-300 hover:bg-slate-800/50 hover:text-white border-l-2 border-transparent"
                                    }`
                                }
                            >
                                <div className={`flex items-center justify-center w-10 h-10 rounded-lg transition-all ${
                                    collapsed ? "mx-auto" : ""
                                }`}>
                                    <Icon size={20} className="shrink-0" />
                                </div>
                                {!collapsed && (
                                    <span className="text-sm font-medium">{item.name}</span>
                                )}
                                {/* Tooltip for collapsed state */}
                                {collapsed && (
                                    <div className="absolute left-16 bg-slate-800 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap shadow-xl z-50">
                                        {item.name}
                                    </div>
                                )}
                            </NavLink>
                        );
                    })}
                </nav>

                {/* Logout */}
                <div className="p-3 border-t border-slate-700/50">
                    <button
                        onClick={logout}
                        className={`group relative flex items-center gap-3 w-full px-3 py-2.5 rounded-xl transition-all duration-200 text-slate-300 hover:bg-red-600/20 hover:text-red-400 ${
                            collapsed ? "justify-center" : ""
                        }`}
                    >
                        <div className="flex items-center justify-center w-10 h-10 rounded-lg">
                            <LogOut size={20} className="shrink-0" />
                        </div>
                        {!collapsed && <span className="text-sm font-medium">Logout</span>}
                        {collapsed && (
                            <div className="absolute left-16 bg-slate-800 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap shadow-xl z-50">
                                Logout
                            </div>
                        )}
                    </button>
                </div>

                {/* Mobile toggle button */}
                <button
                    onClick={() => setCollapsed(false)}
                    className={`fixed bottom-6 right-6 z-50 lg:hidden flex items-center justify-center w-12 h-12 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition-all ${
                        collapsed ? "opacity-100 scale-100" : "opacity-0 scale-0 pointer-events-none"
                    }`}
                >
                    <Menu size={24} />
                </button>
            </aside>
        </>
    );
}
