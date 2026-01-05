import React, { Suspense, lazy } from 'react';
import ScrollToTop from './src/components/ScrollToTop';
import { Routes, Route } from 'react-router-dom';
import LoadingSpinner from './src/components/LoadingSpinner';
import ProtectedRoute from './src/components/ProtectedRoute';

// Lazy load Admin Layout (Named Export)
const AdminLayout = lazy(() => import('./src/components/layouts/AdminLayout').then(module => ({ default: module.AdminLayout })));

// Lazy load Public Pages
const HomePage = lazy(() => import('./src/pages/Home'));
const BlogPage = lazy(() => import('./src/pages/Blog'));
const BlogPostDetail = lazy(() => import('./src/pages/BlogPostDetail'));
const ServicesPage = lazy(() => import('./src/pages/Services'));
const AboutPage = lazy(() => import('./src/pages/About'));
const ContactPage = lazy(() => import('./src/pages/Contact'));
const LoginPage = lazy(() => import('./src/pages/Login'));

// Lazy load Admin Pages
const DashboardHome = lazy(() => import('./src/pages/admin/DashboardHome'));
const MediaLibrary = lazy(() => import('./src/pages/admin/MediaLibrary'));
const PortfolioManager = lazy(() => import('./src/pages/admin/PortfolioManager'));
const BlogManager = lazy(() => import('./src/pages/admin/BlogManager'));
const ServiceManager = lazy(() => import('./src/pages/admin/ServiceManager'));
const CommentsManager = lazy(() => import('./src/pages/admin/CommentsManager'));
const TestimonialsManager = lazy(() => import('./src/pages/admin/TestimonialsManager'));
const Settings = lazy(() => import('./src/pages/admin/Settings'));
const TestComponents = lazy(() => import('./src/pages/TestComponents'));

const App = () => {
    return (
        <>
            <ScrollToTop />
            <Suspense fallback={<LoadingSpinner />}>
                <Routes>
                    <Route path="/test-components" element={<TestComponents />} />
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
            </Suspense>
        </>
    );
};

export default App;
