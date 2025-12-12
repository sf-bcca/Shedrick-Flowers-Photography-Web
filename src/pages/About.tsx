import React from 'react';
import { PageLayout } from '../components/Layout';

const AboutPage = () => {
    return (
        <PageLayout>
            <div className="py-20 px-4 text-center">
                <h1 className="text-4xl font-bold">About Us</h1>
                <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">We are passionate photographers capturing the world's beauty.</p>
            </div>
        </PageLayout>
    );
};

export default AboutPage;
