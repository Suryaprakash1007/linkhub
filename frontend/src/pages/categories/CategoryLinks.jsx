import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { getCategoryLinks } from "../../services/categoryService";
import { deleteLink } from "../../services/linkService";
import LinkCard from "../../components/links/LinkCard";
import api from "../../api/axios";
import toast from "react-hot-toast";
import { X } from "lucide-react";

export default function CategoryLinks() {

    const { id } = useParams();

    const [links, setLinks] = useState([]);

    useEffect(() => {
        fetchLinks();
    }, []);

    const fetchLinks = async () => {
        const response = await getCategoryLinks(id);
        setLinks(response);
    };

    const handleRemoveFromCategory = async (linkId) => {
        if (!window.confirm("Remove this link from the category?")) return;
        try {
            await api.delete(`/api/links/${linkId}/category`);
            toast.success("Link removed from category");
            fetchLinks();
        } catch (error) {
            toast.error("Failed to remove from category");
        }
    };

    return (
        <DashboardLayout>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Category Links</h1>
            </div>

            {links.length === 0 ? (
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-12 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center mx-auto mb-4">
                        <X size={32} className="text-slate-400" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">No Links Found</h2>
                    <p className="text-slate-500 dark:text-slate-400">This category has no links yet.</p>
                </div>
            ) : (
                <div className="grid gap-5">
                    {links.map(link => (
                        <LinkCard
                            key={`${link.id}`}
                            link={link}
                            context="category"
                            onRefresh={fetchLinks}
                            onDelete={() => {}}
                            onEdit={() => {}}
                            onAssignTag={() => {}}
                            onAssignCategory={() => {}}
                            onAssignCollection={() => {}}
                            onRemoveCategory={handleRemoveFromCategory}
                        />
                    ))}
                </div>
            )}
        </DashboardLayout>
    );
}
