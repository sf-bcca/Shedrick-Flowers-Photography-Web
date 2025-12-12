import React from 'react';
import { PageLayout } from '../components/Layout';

const HomePage = () => {
    return (
        <PageLayout>
            <section className="relative h-[90vh] -mt-16 w-full flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAdOA3mAUqDUcHv1Eijk2LLjTmE2t6rWsDLyzPK1GKFuDmz_p2KwWtjZb9SEHZNDUEQGuU5rFGpv1dOmbhc43DY512hCI_HESxYWAxWwstP9nwxKgvlJ4aQwghXEGeb6gcFT96l2Qqr924qBjaCOHngdFyGDqXWqz_p9x5Pz1SU8iNXurBKcPcJNvkvfaYekZ98lGXjLq5fC1GATlHUk1yndhG1np_noJIfm-254JrwbJ5ly_oNejJ9dO3AHooDyNRJ6HBCEAQdQK5P"
                        alt="Hero"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/40 to-black/30"></div>
                </div>
                <div className="relative z-10 container mx-auto px-4 text-center">
                    <h1 className="text-white text-5xl md:text-7xl lg:text-8xl font-black leading-[1.05] tracking-tight max-w-5xl drop-shadow-2xl">
                        Capturing Life's <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-white to-blue-200">Fleeting Moments</span>
                    </h1>
                </div>
            </section>
        </PageLayout>
    );
};

export default HomePage;
