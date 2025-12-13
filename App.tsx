import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './src/components/ProtectedRoute';

// Lazy Load Public Pages
const HomePage = React.lazy(() => import('./src/pages/Home'));
const BlogPage = React.lazy(() => import('./src/pages/Blog'));
const ServicesPage = React.lazy(() => import('./src/pages/Services'));
const AboutPage = React.lazy(() => import('./src/pages/About'));
const ContactPage = React.lazy(() => import('./src/pages/Contact'));
const LoginPage = React.lazy(() => import('./src/pages/Login'));

// Lazy Load Admin Components
const AdminLayout = React.lazy(() => import('./src/components/layouts/AdminLayout').then(module => ({ default: module.AdminLayout })));
const DashboardHome = React.lazy(() => import('./src/pages/admin/DashboardHome'));
const MediaLibrary = React.lazy(() => import('./src/pages/admin/MediaLibrary'));
const PortfolioManager = React.lazy(() => import('./src/pages/admin/PortfolioManager'));
const BlogManager = React.lazy(() => import('./src/pages/admin/BlogManager'));
const ServiceManager = React.lazy(() => import('./src/pages/admin/ServiceManager'));
const CommentsManager = React.lazy(() => import('./src/pages/admin/CommentsManager'));
const Settings = React.lazy(() => import('./src/pages/admin/Settings'));

// Loading Fallback
const PageLoader = () => (
    <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
    </div>
);

const App = () => {
    return (
        <Suspense fallback={<PageLoader />}>
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/blog" element={<BlogPage />} />
                <Route path="/services" element={<ServicesPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/login" element={<LoginPage />} />

                {/* Admin Routes (Nested) */}
                <Route path="/admin" element={
                    <ProtectedRoute>
                        <AdminLayout />
                    </ProtectedRoute>
                }>
                    <Route index element={<DashboardHome />} />
                    <Route path="media" element={<MediaLibrary />} />
                    <Route path="portfolio" element={<PortfolioManager />} />
                    <Route path="blog" element={<BlogManager />} />
                    <Route path="services" element={<ServiceManager />} />
                    <Route path="comments" element={<CommentsManager />} />
                    <Route path="settings" element={<Settings />} />
                </Route>
            </Routes>
        </Suspense>
    );
};

export default App;
