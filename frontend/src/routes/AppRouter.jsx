import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";
import VerifyEmail from "../pages/auth/VerifyEmail";
import ResetPassword from "../pages/auth/ResetPassword";
import Dashboard from "../pages/dashboard/Dashboard";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "../components/PublicRoute";
import MyLinks from "../pages/links/MyLinks";
import Collections from "../pages/collections/Collections";
import Tags from "../pages/tags/Tags";
import TagLinks from "../pages/tags/TagLinks";
import Analytics from "../pages/analytics/Analytics";
import Categories from "../pages/categories/Categories";
import CategoryLinks from "../pages/categories/CategoryLinks";
import CollectionLinks from "../pages/collections/CollectionLinks";
import Profile from "../pages/profile/Profile";
import Posts from "../pages/posts/Posts";
import PublicProfile from "../pages/public/PublicProfile";
import OAuth2RedirectHandler from "../pages/auth/OAuth2RedirectHandler";

export default function AppRouter() {

    return (
        <BrowserRouter>

            <Routes>

                <Route
    path="/"
    element={
        <Navigate to="/dashboard" replace />
    }
/>

                <Route
    path="/login"
    element={
        <PublicRoute>
            <Login />
        </PublicRoute>
    }
/>

<Route
    path="/register"
    element={
        <PublicRoute>
            <Register />
        </PublicRoute>
    }
/>

<Route
    path="/forgot-password"
    element={
        <PublicRoute>
            <ForgotPassword />
        </PublicRoute>
    }
/>

<Route
    path="/verify-email"
    element={<VerifyEmail />}
/>

<Route
    path="/reset-password"
    element={<ResetPassword />}
/>

<Route
    path="/u/:username"
    element={<PublicProfile />}
/>

<Route
    path="/oauth2/redirect"
    element={<OAuth2RedirectHandler />}
/>

                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
    path="/links"
    element={
        <ProtectedRoute>
            <MyLinks />
        </ProtectedRoute>
    }
/>
                <Route
    path="/collections"
    element={
        <ProtectedRoute>
            <Collections />
        </ProtectedRoute>
    }
/>
                <Route
    path="/tags"
    element={
        <ProtectedRoute>
            <Tags />
        </ProtectedRoute>
    }
/>
                <Route
    path="/tags/:id"
    element={
        <ProtectedRoute>
            <TagLinks />
        </ProtectedRoute>
    }
/>
                <Route
    path="/analytics"
    element={
        <ProtectedRoute>
            <Analytics />
        </ProtectedRoute>
    }
/>
                <Route
    path="/categories"
    element={
        <ProtectedRoute>
            <Categories />
        </ProtectedRoute>
    }
/>
                <Route
    path="/categories/:id"
    element={
        <ProtectedRoute>
            <CategoryLinks />
        </ProtectedRoute>
    }
/>
                <Route
    path="/collections/:id"
    element={
        <ProtectedRoute>
            <CollectionLinks />
        </ProtectedRoute>
    }
/>
                <Route
    path="/posts"
    element={
        <ProtectedRoute>
            <Posts />
        </ProtectedRoute>
    }
/>
                <Route
    path="/profile"
    element={
        <ProtectedRoute>
            <Profile />
        </ProtectedRoute>
    }
/>
            </Routes>
            

        </BrowserRouter>
    );
}