import React from 'react';
import ScrollToTop from './src/components/ScrollToTop';
import { Routes, Route } from 'react-router-dom';
import HomePage from './src/pages/Home';
import BlogPage from './src/pages/Blog';
import BlogPostDetail from './src/pages/BlogPostDetail';
import ServicesPage from './src/pages/Services';
import AboutPage from './src/pages/About';
import ContactPage from './src/pages/Contact';
import LoginPage from './src/pages/Login';

// Admin Imports
import { AdminLayout } from './src/components/layouts/AdminLayout';
import DashboardHome from './src/pages/admin/DashboardHome';
import MediaLibrary from './src/pages/admin/MediaLibrary';
import PortfolioManager from './src/pages/admin/PortfolioManager';
import BlogManager from './src/pages/admin/BlogManager';
import ServiceManager from './src/pages/admin/ServiceManager';
import CommentsManager from './src/pages/admin/CommentsManager';
import TestimonialsManager from './src/pages/admin/TestimonialsManager';
import Settings from './src/pages/admin/Settings';
import ProtectedRoute from './src/components/ProtectedRoute';

const App = () => {
    return (
        <>
            <ScrollToTop />
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/blog" element={<BlogPage />} />
                <Route path="/blog/:id" element={<BlogPostDetail />} />
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
                    <Route path="testimonials" element={<TestimonialsManager />} />
                    <Route path="settings" element={<Settings />} />
                </Route>
            </Routes>
        </>
    );
};

export default App;
