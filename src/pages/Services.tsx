import React from 'react';
import { PageLayout } from '../components/Layout';

const ServicesPage = () => {
    return (
        <PageLayout>
            <div className="py-20 px-4 text-center">
                <h1 className="text-4xl font-bold">Our Services</h1>
                <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">Professional photography for weddings, portraits, and events.</p>
            </div>
        </PageLayout>
    );
};

export default ServicesPage;
