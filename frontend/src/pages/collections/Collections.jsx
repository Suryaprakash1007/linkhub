import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import CollectionCard from "../../components/collections/CollectionCard";
import CreateCollectionModal from "../../components/collections/CreateCollectionModal";
import { getCollections } from "../../services/collectionService";
import { Plus, Search, FolderKanban, Loader2 } from "lucide-react";

export default function Collections() {
    const [collections, setCollections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openModal, setOpenModal] = useState(false);
    const [editingCollection, setEditingCollection] = useState(null);
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetchCollections();
    }, []);

    const fetchCollections = async () => {
        try {
            const data = await getCollections();
            setCollections(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const filtered = collections.filter(
        (c) =>
            c.name?.toLowerCase().includes(search.toLowerCase()) ||
            c.description?.toLowerCase().includes(search.toLowerCase())
    );

    const SkeletonCard = () => (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 animate-pulse">
            <div className="space-y-3">
                <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/4" />
            </div>
            <div className="flex gap-2 mt-4">
                <div className="h-9 bg-slate-200 dark:bg-slate-700 rounded-xl w-20" />
                <div className="h-9 bg-slate-200 dark:bg-slate-700 rounded-xl w-20" />
            </div>
        </div>
    );

    return (
        <DashboardLayout>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Collections</h1>
                    <p className="text-slate-500 dark:text-slate-400">Organize links into collections</p>
                </div>
                <button
                    onClick={() => {
                        setEditingCollection(null);
                        setOpenModal(true);
                    }}
                    className="btn-primary px-5 py-3 rounded-xl text-sm flex items-center gap-2"
                >
                    <Plus size={18} />
                    Create Collection
                </button>
            </div>

{loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <SkeletonCard key={i} />
                    ))}
                </div>
            ) : filtered.length === 0 ? (
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-12 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center mx-auto mb-4">
                        <FolderKanban size={32} className="text-slate-400" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">
                        {search ? "No collections found" : "No Collections Yet"}
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 mb-6">
                        {search ? "Try a different search term" : "Create your first collection to organize links."}
                    </p>
                    {!search && (
                        <button
                            onClick={() => setOpenModal(true)}
                            className="btn-primary px-6 py-3 rounded-xl text-sm"
                        >
                            <Plus size={18} />
                            Create Your First Collection
                        </button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filtered.map((collection) => (
                        <CollectionCard
                            key={collection.id}
                            collection={collection}
                            onRefresh={fetchCollections}
                            onEdit={(collection) => {
                                setEditingCollection(collection);
                                setOpenModal(true);
                            }}
                        />
                    ))}
                </div>
            )}

            <CreateCollectionModal
                isOpen={openModal}
                onClose={() => {
                    setOpenModal(false);
                    setEditingCollection(null);
                }}
                editCollection={editingCollection}
                onSuccess={fetchCollections}
            />
        </DashboardLayout>
    );
}
