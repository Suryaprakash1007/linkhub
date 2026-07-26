import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Chatbot from "../chat/Chatbot";

export default function DashboardLayout({ children }) {

    return (

        <div className="flex min-h-screen bg-slate-100">

            <Sidebar />

            <div className="flex-1 flex flex-col">

                <Navbar />

                <main className="flex-1 p-6">
                    {children}
                </main>
            </div>
            <Chatbot />
        </div>

    );

}