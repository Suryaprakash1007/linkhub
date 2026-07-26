import toast from "react-hot-toast";
import { deleteLink } from "../../services/linkService";

export default function DeleteLinkModal({
    open,
    onClose,
    linkId,
    onSuccess
}) {

    if (!open) return null;

    const handleDelete = async () => {

        try {

            await deleteLink(linkId);

            toast.success("Link deleted successfully");

            onSuccess();

            onClose();

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Failed to delete link"
            );

        }

    };

    return (

        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">

            <div className="bg-white rounded-xl p-8 w-full max-w-md shadow-xl">

                <h2 className="text-2xl font-bold mb-4">

                    Delete Link

                </h2>

                <p className="text-gray-600 mb-8">

                    Are you sure you want to delete this link?

                    <br />

                    This action cannot be undone.

                </p>

                <div className="flex justify-end gap-3">

                    <button
                        onClick={onClose}
                        className="border px-5 py-2 rounded-lg"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleDelete}
                        className="bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700"
                    >
                        Delete
                    </button>

                </div>

            </div>

        </div>

    );

}