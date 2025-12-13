import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

// Lazy load pages
const HomePage = React.lazy(() => import('./pages/Home'));
const BlogPage = React.lazy(() => import('./pages/Blog'));
const ServicesPage = React.lazy(() => import('./pages/Services'));
const AboutPage = React.lazy(() => import('./pages/About'));
const ContactPage = React.lazy(() => import('./pages/Contact'));
const LoginPage = React.lazy(() => import('./pages/Login'));
const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard'));

// Loading fallback
const PageLoader = () => (
    <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
    </div>
);

const App = () => {
    return (
        <Suspense fallback={<PageLoader />}>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/blog" element={<BlogPage />} />
                <Route path="/services" element={<ServicesPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/admin" element={<AdminDashboard />} />
            </Routes>
        </Suspense>
    );
};

export default App;
