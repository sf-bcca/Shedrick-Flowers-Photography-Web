import React from 'react';
import { PageLayout } from '../components/Layout';

const ContactPage = () => {
    return (
        <PageLayout>
            <div className="py-20 px-4 text-center">
                <h1 className="text-4xl font-bold">Contact Us</h1>
                <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">Get in touch to book your session.</p>
            </div>
        </PageLayout>
    );
};

export default ContactPage;
