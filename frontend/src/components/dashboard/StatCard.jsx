export default function StatCard({
    title,
    value,
    color = "bg-blue-600",
}) {
    return (
        <div className="bg-white rounded-xl shadow p-6
                        hover:shadow-lg
                        hover:-translate-y-1
                        transition-all
                        duration-200">

            <div className="flex justify-between items-center">

                <div>

                    <p className="text-gray-500 text-sm">
                        {title}
                    </p>

                    <h2 className="text-3xl font-bold mt-2">
                        {value}
                    </h2>

                </div>

                <div
                    className={`w-12 h-12 rounded-full ${color}`}
                />

            </div>

        </div>
    );
}