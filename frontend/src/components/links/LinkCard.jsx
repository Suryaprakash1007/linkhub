import { useState } from "react";
import {
    Copy,
    Pencil,
    Trash2,
    Star,
    Pin,
    MousePointerClick,
    FolderOpen,
    Tag,
    QrCode,
    Share2,
    Lock,
    CalendarClock,
    ExternalLink,
    Check,
    Loader2,
    X
} from "lucide-react";
import {
    favoriteLink,
    unfavoriteLink,
    pinLink,
    unpinLink
} from "../../services/linkService";
import api from "../../api/axios";
import toast from "react-hot-toast";

function LinkCard({
    link,
    onDelete,
    onEdit,
    onAssignTag,
    onRefresh,
    onAssignCategory,
    onAssignCollection,
    onRemoveCategory,
    onRemoveCollection,
    onRemoveTag,
    context = "default"
}) {
    const [copied, setCopied] = useState(false);
    const [qrLoading, setQrLoading] = useState(false);

    const copyLink = () => {
        navigator.clipboard.writeText(link.shortUrl);
        setCopied(true);
        toast.success("Short URL copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
    };

    const shareLink = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: link.title || "Check out this link",
                    url: link.shortUrl,
                });
            } catch {
                // User cancelled
            }
        } else {
            copyLink();
        }
    };

    const downloadQRCode = async () => {
        setQrLoading(true);
        try {
            const response = await api.get(`/api/links/${link.id}/qrcode`, {
                responseType: "blob",
            });
            const url = URL.createObjectURL(response.data);
            const a = document.createElement("a");
            a.href = url;
            a.download = `qrcode-${link.shortCode || link.id}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            toast.success("QR Code downloaded!");
        } catch (error) {
            toast.error("Failed to generate QR code");
        } finally {
            setQrLoading(false);
        }
    };

    const handleFavorite = async () => {
        try {
            if (link.isFavorite) {
                await unfavoriteLink(link.id);
                toast.success("Removed from favorites");
            } else {
                await favoriteLink(link.id);
                toast.success("Added to favorites");
            }
            onRefresh();
        } catch (error) {
            toast.error("Failed to update favorite");
        }
    };

    const handlePin = async () => {
        try {
            if (link.isPinned) {
                await unpinLink(link.id);
                toast.success("Link unpinned");
            } else {
                await pinLink(link.id);
                toast.success("Link pinned");
            }
            onRefresh();
        } catch (error) {
            toast.error("Failed to update pin");
        }
    };

    const isExpired = link.expirationDate && new Date(link.expirationDate) < new Date();

    return (
        <div className="group bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300">
            {/* Top Row: Title + Actions */}
            <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white truncate">
                            {link.title || "Untitled Link"}
                        </h3>
                        {/* Password Protected Badge */}
                        {link.password && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-medium">
                                <Lock size={12} />
                                Protected
                            </span>
                        )}
                        {/* Expired Badge */}
                        {isExpired && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs font-medium">
                                <CalendarClock size={12} />
                                Expired
                            </span>
                        )}
                    </div>
                    <a
                        href={link.shortUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium text-sm hover:underline mt-1"
                    >
                        {link.shortUrl}
                        <ExternalLink size={14} />
                    </a>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-1 shrink-0">
                    <button
                        onClick={handleFavorite}
                        className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                        title={link.isFavorite ? "Remove from favorites" : "Add to favorites"}
                    >
                        <Star
                            size={18}
                            className={
                                link.isFavorite
                                    ? "text-yellow-500 fill-yellow-500"
                                    : "text-slate-400 dark:text-slate-500"
                            }
                        />
                    </button>
                    <button
                        onClick={handlePin}
                        className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                        title={link.isPinned ? "Unpin" : "Pin"}
                    >
                        <Pin
                            size={18}
                            className={
                                link.isPinned
                                    ? "text-red-500 fill-red-500"
                                    : "text-slate-400 dark:text-slate-500"
                            }
                        />
                    </button>
                </div>
            </div>

            {/* Original URL */}
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 truncate">
                {link.originalUrl}
            </p>

            {/* Tags / Chips */}
            {link.tags && link.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                    {link.tags.map((tag, idx) => (
                        <span
                            key={`tag-${idx}`}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs font-medium"
                        >
                            <Tag size={12} />
                            {tag}
                        </span>
                    ))}
                </div>
            )}

            {/* Category / Collection Badges */}
            {(link.categoryName || (link.collections && link.collections.length > 0)) && (
                <div className="flex flex-wrap gap-2 mt-2">
                    {link.categoryName && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 text-xs font-medium">
                            📁 {link.categoryName}
                        </span>
                    )}
                    {link.collections?.map((col, idx) => (
                        <span
                            key={`col-${idx}`}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 text-xs font-medium"
                        >
                            <FolderOpen size={12} />
                            {col}
                        </span>
                    ))}
                </div>
            )}

            {/* Stats Row */}
            <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
                    <MousePointerClick size={16} />
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                        {link.clickCount}
                    </span>
                </div>
                {/* Click Progress Bar */}
                <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden max-w-[100px]">
                    <div
                        className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all"
                        style={{
                            width: `${Math.min((link.clickCount / 100) * 100, 100)}%`,
                        }}
                    />
                </div>
                <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        link.isActive && !isExpired
                            ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
                            : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                    }`}
                >
                    {link.isActive && !isExpired ? "🟢 Active" : "🔴 Inactive"}
                </span>
                {/* Expiry Date */}
                {link.expirationDate && !isExpired && (
                    <span className="text-xs text-slate-400">
                        Expires: {new Date(link.expirationDate).toLocaleDateString()}
                    </span>
                )}
            </div>

            {/* Action Buttons Row */}
            <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                <button
                    onClick={copyLink}
                    className="relative inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
                >
                    {copied ? (
                        <>
                            <Check size={16} className="text-emerald-500" />
                            <span className="text-emerald-500">Copied!</span>
                        </>
                    ) : (
                        <>
                            <Copy size={16} />
                            Copy
                        </>
                    )}
                </button>

                {context === "default" && (
                    <>
                        <button
                            onClick={shareLink}
                            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 transition"
                        >
                            <Share2 size={16} />
                            Share
                        </button>

                        <button
                            onClick={downloadQRCode}
                            disabled={qrLoading}
                            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-violet-50 dark:hover:bg-violet-900/20 hover:text-violet-600 transition disabled:opacity-50"
                        >
                            {qrLoading ? (
                                <Loader2 size={16} className="animate-spin" />
                            ) : (
                                <QrCode size={16} />
                            )}
                            QR Code
                        </button>

                        <button
                            onClick={() => onAssignTag(link.id)}
                            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-600 transition"
                        >
                            <Tag size={16} />
                            Tag
                        </button>

                        <button
                            onClick={() => onAssignCategory(link.id)}
                            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-600 transition"
                        >
                            Category
                        </button>

                        <button
                            onClick={() => onAssignCollection(link.id)}
                            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-600 transition"
                        >
                            <FolderOpen size={16} />
                            Collection
                        </button>

                        <button
                            onClick={() => onEdit(link)}
                            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 transition"
                        >
                            <Pencil size={16} />
                            Edit
                        </button>

                        <button
                            onClick={() => onDelete(link.id)}
                            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                        >
                            <Trash2 size={16} />
                            Delete
                        </button>
                    </>
                )}

                {/* Contextual: category page only needs remove from category */}
                {context === "category" && (
                    <button
                        onClick={() => onRemoveCategory && onRemoveCategory(link.id)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                    >
                        <X size={16} />
                        Remove from Category
                    </button>
                )}

                {/* Contextual: collection page only needs remove from collection */}
                {context === "collection" && (
                    <button
                        onClick={() => onRemoveCollection && onRemoveCollection(link.id)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                    >
                        <X size={16} />
                        Remove from Collection
                    </button>
                )}

                {/* Contextual: tag page only needs remove tag */}
                {context === "tag" && (
                    <button
                        onClick={() => onRemoveTag && onRemoveTag(link.id)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                    >
                        <X size={16} />
                        Remove Tag
                    </button>
                )}
            </div>
        </div>
    );
}

export default LinkCard;

