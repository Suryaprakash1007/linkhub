import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import LinkCard from "../../components/links/LinkCard";
import { getTagLinks } from "../../services/tagService";
import { deleteLink } from "../../services/linkService";
import api from "../../api/axios";
import toast from "react-hot-toast";
import { X } from "lucide-react";

export default function TagLinks() {

    const { id } = useParams();

    const [links, setLinks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLinks();
    }, []);

    const fetchLinks = async () => {
        try {
            const response = await getTagLinks(id);
            setLinks(response);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveTag = async (linkId) => {
        if (!window.confirm("Remove this tag from the link?")) return;
        try {
            await api.delete(`/api/links/${linkId}/tags/${id}`);
            toast.success("Tag removed from link");
            fetchLinks();
        } catch (error) {
            toast.error("Failed to remove tag");
        }
    };

    return (
        <DashboardLayout>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Tag Links</h1>
            </div>

            {loading ? (
                <div className="grid gap-5">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 animate-pulse">
                            <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-1/3 mb-3" />
                            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-2/3" />
                        </div>
                    ))}
                </div>
            ) : links.length === 0 ? (
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-12 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center mx-auto mb-4">
                        <X size={32} className="text-slate-400" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">No Links Found</h2>
                    <p className="text-slate-500 dark:text-slate-400">This tag has no links yet.</p>
                </div>
            ) : (
                <div className="grid gap-5">
                    {links.map(link => (
                        <LinkCard
                            key={`${link.id}`}
                            link={link}
                            context="tag"
                            onRefresh={fetchLinks}
                            onDelete={() => {}}
                            onEdit={() => {}}
                            onAssignTag={() => {}}
                            onAssignCategory={() => {}}
                            onAssignCollection={() => {}}
                            onRemoveTag={handleRemoveTag}
                        />
                    ))}
                </div>
            )}
        </DashboardLayout>
    );
}
