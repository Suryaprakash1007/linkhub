import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { getCollectionLinks } from "../../services/collectionService";
import { deleteLink } from "../../services/linkService";
import LinkCard from "../../components/links/LinkCard";
import api from "../../api/axios";
import toast from "react-hot-toast";
import { X } from "lucide-react";

export default function CollectionLinks() {

    const { id } = useParams();

    const [links, setLinks] = useState([]);

    useEffect(() => {
        loadLinks();
    }, []);

    const loadLinks = async () => {
        const data = await getCollectionLinks(id);
        setLinks(data);
    };

    const handleRemoveFromCollection = async (linkId) => {
        if (!window.confirm("Remove this link from the collection?")) return;
        try {
            await api.delete(`/api/collections/${id}/remove/${linkId}`);
            toast.success("Link removed from collection");
            loadLinks();
        } catch (error) {
            toast.error("Failed to remove from collection");
        }
    };

    return (
        <DashboardLayout>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Collection Links</h1>
            </div>

            {links.length === 0 ? (
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-12 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center mx-auto mb-4">
                        <X size={32} className="text-slate-400" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">No Links Found</h2>
                    <p className="text-slate-500 dark:text-slate-400">This collection has no links yet.</p>
                </div>
            ) : (
                <div className="grid gap-5">
                    {links.map(link => (
                        <LinkCard
                            key={`${link.id}`}
                            link={link}
                            context="collection"
                            onRefresh={loadLinks}
                            onDelete={() => {}}
                            onEdit={() => {}}
                            onAssignTag={() => {}}
                            onAssignCategory={() => {}}
                            onAssignCollection={() => {}}
                            onRemoveCollection={handleRemoveFromCollection}
                        />
                    ))}
                </div>
            )}
        </DashboardLayout>
    );
}
