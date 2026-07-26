import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
    getMyTags,
    assignTag
} from "../../services/tagService";

export default function AssignTagModal({

    open,
    onClose,
    linkId,
    onSuccess

}) {

    const [tags, setTags] = useState([]);

    const [selectedTag, setSelectedTag] = useState("");

    useEffect(() => {

        if (open) {

            loadTags();

        }

    }, [open]);

    const loadTags = async () => {

        try {

            const data = await getMyTags();

            setTags(data);

        }

        catch (err) {

            console.error(err);

        }

    };

    const handleAssign = async () => {

        if (!selectedTag) {

            toast.error("Select a tag");

            return;

        }

        try {

            await assignTag(linkId, selectedTag);

            toast.success("Tag assigned");

            onSuccess();

            onClose();

        }

        catch (err) {

            toast.error("Failed");

        }

    };

    if (!open) return null;

    return (

        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">

            <div className="bg-white rounded-xl p-8 w-96">

                <h2 className="text-xl font-bold mb-6">

                    Assign Tag

                </h2>

                <select

                    className="border rounded-lg w-full p-3"

                    value={selectedTag}

                    onChange={(e) =>
                        setSelectedTag(e.target.value)
                    }

                >

                    <option value="">

                        Select Tag

                    </option>

                    {

                        tags.map(tag => (

                            <option
                                key={tag.id}
                                value={tag.id}
                            >

                                {tag.name}

                            </option>

                        ))

                    }

                </select>

                <div className="flex justify-end gap-3 mt-6">

                    <button

                        onClick={onClose}

                        className="border px-4 py-2 rounded"

                    >

                        Cancel

                    </button>

                    <button

                        onClick={handleAssign}

                        className="bg-blue-600 text-white px-4 py-2 rounded"

                    >

                        Assign

                    </button>

                </div>

            </div>

        </div>

    );

}