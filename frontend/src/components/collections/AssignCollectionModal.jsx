import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
    getCollections,
    assignCollection
} from "../../services/collectionService";

export default function AssignCollectionModal({
    isOpen,
    onClose,
    linkId,
    onSuccess
}) {

    const [collections, setCollections] = useState([]);
    const [selectedCollection, setSelectedCollection] = useState("");

    useEffect(() => {

        if (!isOpen) return;

        setSelectedCollection("");

        loadCollections();

    }, [isOpen]);

    const loadCollections = async () => {

        try {

            const data = await getCollections();

            setCollections(data);

        } catch (error) {

            toast.error("Failed to load collections");

        }

    };

    const handleAssign = async () => {

        if (!selectedCollection) {

            toast.error("Please select a collection");

            return;

        }

        try {

            await assignCollection(selectedCollection, linkId);

            toast.success("Collection assigned successfully");

            setSelectedCollection("");

            onSuccess();

            onClose();

        } catch (error) {

            toast.error("Assignment failed");

        }

    };

    if (!isOpen) return null;

    return (

        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">

            <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-8">

                <h2 className="text-2xl font-bold mb-6">
                    Assign Collection
                </h2>

                <select
                    className="w-full border rounded-lg p-3"
                    value={selectedCollection}
                    onChange={(e) => setSelectedCollection(e.target.value)}
                >

                    <option value="">
                        Select Collection
                    </option>

                    {collections.map((collection) => (

                        <option
                            key={collection.id}
                            value={collection.id}
                        >
                            {collection.name}
                        </option>

                    ))}

                </select>

                <div className="flex justify-end gap-3 mt-6">

                    <button
                        type="button"
                        onClick={onClose}
                        className="border rounded-lg px-5 py-2"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={handleAssign}
                        className="bg-blue-600 text-white rounded-lg px-5 py-2 hover:bg-blue-700"
                    >
                        Assign
                    </button>

                </div>

            </div>

        </div>

    );

}