import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPublicProfile, getPublicLinks } from "../../services/publicProfileService";
import { Link2, MapPin, GraduationCap, Building2, User, ExternalLink, Loader2 } from "lucide-react";

export default function PublicProfile() {
    const { username } = useParams();
    const [profile, setProfile] = useState(null);
    const [links, setLinks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                setLoading(true);
                const profileData = await getPublicProfile(username);
                const linksData = await getPublicLinks(username);
                setProfile(profileData);
                setLinks(linksData);
            } catch (err) {
                setError(err.response?.data?.message || "User not found or an error occurred.");
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();
    }, [username]);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
            </div>
        );
    }

    if (error || !profile) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 text-center">
                <div className="w-24 h-24 bg-slate-200 rounded-full flex items-center justify-center mb-6">
                    <User className="w-12 h-12 text-slate-400" />
                </div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Profile Not Found</h1>
                <p className="text-slate-500 mb-8 max-w-md">
                    {error}
                </p>
                <a href="/" className="btn-primary px-8 py-3 rounded-full font-medium shadow-lg">
                    Go to LinkHub
                </a>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 relative overflow-hidden py-12 px-4">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-blue-100/50 to-transparent pointer-events-none" />
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl" />
            <div className="absolute top-20 -left-40 w-72 h-72 bg-purple-400/10 rounded-full blur-3xl" />

            <div className="max-w-2xl mx-auto relative z-10">
                {/* Profile Header */}
                <div className="flex flex-col items-center text-center mb-10">
                    <div className="w-32 h-32 rounded-full border-4 border-white shadow-xl overflow-hidden mb-6 bg-white flex items-center justify-center">
                        {profile.profilePicture ? (
                            <img
                                src={profile.profilePicture}
                                alt={profile.fullName}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <User className="w-16 h-16 text-slate-300" />
                        )}
                    </div>
                    
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">{profile.fullName}</h1>
                    <p className="text-slate-500 font-medium mb-4">@{profile.username}</p>

                    {profile.bio && (
                        <p className="text-slate-600 mb-6 max-w-md text-lg leading-relaxed">
                            {profile.bio}
                        </p>
                    )}

                    <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-500">
                        {profile.location && (
                            <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full shadow-sm border border-slate-100">
                                <MapPin className="w-4 h-4 text-blue-500" />
                                {profile.location}
                            </div>
                        )}
                        {profile.college && (
                            <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full shadow-sm border border-slate-100">
                                <GraduationCap className="w-4 h-4 text-purple-500" />
                                {profile.college}
                            </div>
                        )}
                        {profile.department && (
                            <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full shadow-sm border border-slate-100">
                                <Building2 className="w-4 h-4 text-emerald-500" />
                                {profile.department}
                            </div>
                        )}
                    </div>
                </div>

                {/* Links Container */}
                <div className="space-y-4">
                    {links.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-2xl border border-slate-100 shadow-sm">
                            <Link2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                            <h3 className="text-lg font-medium text-slate-900">No links yet</h3>
                            <p className="text-slate-500">This user hasn't shared any links.</p>
                        </div>
                    ) : (
                        links.map((link) => (
                            <a
                                key={link.id}
                                href={link.shortUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group block bg-white hover:bg-slate-50 p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                                        <Link2 className="w-6 h-6" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-slate-900 truncate mb-1 group-hover:text-blue-600 transition-colors">
                                            {link.title}
                                        </h3>
                                        <p className="text-sm text-slate-500 truncate">
                                            {link.notes || "Click to visit link"}
                                        </p>
                                    </div>
                                    <div className="pl-4 flex-shrink-0">
                                        <ExternalLink className="w-5 h-5 text-slate-300 group-hover:text-blue-500 transition-colors" />
                                    </div>
                                </div>
                            </a>
                        ))
                    )}
                </div>
                
                {/* Footer Logo */}
                <div className="mt-12 text-center pb-8">
                    <a href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-600 transition-colors">
                        <Link2 className="w-5 h-5" />
                        <span className="font-semibold text-sm">Powered by LinkHub</span>
                    </a>
                </div>
            </div>
        </div>
    );
}
