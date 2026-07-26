import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
    getCategories,
    assignCategory
} from "../../services/categoryService";

export default function AssignCategoryModal({
    isOpen,
    onClose,
    linkId,
    onSuccess
}) {

    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");

    useEffect(() => {

        if (!isOpen) return;

        loadCategories();

    }, [isOpen]);

    const loadCategories = async () => {

        try {

            const data = await getCategories();

            setCategories(data);

        } catch {

            toast.error("Failed to load categories");

        }

    };

    const handleAssign = async () => {

        if (!selectedCategory) {

            toast.error("Select a category");

            return;

        }

        try {

            await assignCategory(selectedCategory, linkId);

            toast.success("Category assigned");

            onSuccess();

            onClose();

        } catch {

            toast.error("Assignment failed");

        }

    };

    if (!isOpen) return null;

    return (

        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">

            <div className="bg-white rounded-xl p-8 w-full max-w-md shadow-xl">

                <h2 className="text-2xl font-bold mb-5">
                    Assign Category
                </h2>

                <select
                    className="border rounded-lg w-full p-3"
                    value={selectedCategory}
                    onChange={(e) =>
                        setSelectedCategory(e.target.value)
                    }
                >

                    <option value="">
                        Select Category
                    </option>

                    {categories.map(category => (

                        <option
                            key={category.id}
                            value={category.id}
                        >
                            {category.name}
                        </option>

                    ))}

                </select>

                <div className="flex justify-end gap-3 mt-6">

                    <button
                        onClick={onClose}
                        className="border rounded-lg px-5 py-2"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleAssign}
                        className="bg-blue-600 text-white rounded-lg px-5 py-2"
                    >
                        Assign
                    </button>

                </div>

            </div>

        </div>

    );
}