import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {

    const [token, setToken] = useState(
        localStorage.getItem("token")
    );

    const [user, setUser] = useState(
        JSON.parse(localStorage.getItem("user"))
    );

    useEffect(() => {
        if (token && !user?.id) {
            import("../api/axios").then(({ default: api }) => {
                api.get("/api/auth/me")
                    .then(response => {
                        setUser(response.data);
                        localStorage.setItem("user", JSON.stringify(response.data));
                    })
                    .catch(() => {
                        // If token is invalid, maybe logout? We'll leave that to axios interceptors
                    });
            });
        }
    }, [token]);

    const login = (response) => {
        localStorage.setItem("token", response.token);
        if (response.user) {
            localStorage.setItem("user", JSON.stringify(response.user));
            setUser(response.user);
        }
        setToken(response.token);
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setToken(null);
        setUser(null);
    };

    return (

        <AuthContext.Provider
            value={{
                user,
                setUser, // Expose setUser in case other components need to update it
                token,
                login,
                logout,
                isAuthenticated: !!token,
            }}
        >
            {children}
        </AuthContext.Provider>

    );
}
