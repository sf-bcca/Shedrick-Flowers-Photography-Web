import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { PageLayout } from '../components/Layout';
import { BlurImage } from '../components/BlurImage';
import { PortfolioCard } from '../components/PortfolioCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { fetchData, fetchSettings } from '../services/supabaseClient';
import { PortfolioItem } from '../types';
import { getSessionStorage, getLocalStorageString } from '../services/storage';

const HomePage = () => {
    const navigate = useNavigate();

    // Lazy initialize state from storage to prevent unnecessary re-renders and layout shifts
    const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>(() =>
        getSessionStorage<PortfolioItem[]>('portfolioItems') || []
    );
    const [loading, setLoading] = useState(() => !getSessionStorage('portfolioItems'));
    const [heroImageUrl, setHeroImageUrl] = useState(() => getLocalStorageString('hero_image_url'));
    const [avatarUrl, setAvatarUrl] = useState(() => getLocalStorageString('avatar_url'));

    const fetchPortfolio = () => {
        // Optimize: Select only necessary fields for the grid to reduce payload
        fetchData('portfolio', 'id, title, category, image, marginTop, marginTopInverse').then((data: any) => {
            setPortfolioItems(data);
            setLoading(false);
            sessionStorage.setItem('portfolioItems', JSON.stringify(data));
        });
    };

    useEffect(() => {
        // If not loaded from cache (or cache was invalid/empty), fetch fresh data
        if (loading) {
            fetchPortfolio();
        }

        // Fetch hero image and avatar from settings
        const loadSettings = async () => {
            const data = await fetchSettings();
            
            if (data) {
                if (data.hero_image_url) {
                    setHeroImageUrl(data.hero_image_url);
                    localStorage.setItem('hero_image_url', data.hero_image_url);
                }
                if (data.avatar_url) {
                    setAvatarUrl(data.avatar_url);
                    localStorage.setItem('avatar_url', data.avatar_url);
                }
            }
        };
        loadSettings();
    }, []);

    // SEO Meta Tags
    useEffect(() => {
        document.title = "Shedrick Flowers Photography | Grenada, MS Wedding & Portrait Photographer";

        const updateMeta = (name: string, content: string) => {
            let element = document.querySelector(`meta[name="${name}"]`);
            if (!element) {
                element = document.createElement('meta');
                element.setAttribute('name', name);
                document.head.appendChild(element);
            }
            element.setAttribute('content', content);
        };

        updateMeta('description', "Award-winning Grenada, MS photography studio specializing in weddings, editorials, and soulful portraits. Capturing authentic, unscripted moments.");
        updateMeta('keywords', "Grenada MS photographer, Mississippi wedding photography, portrait studio, editorial photography, Shedrick Flowers Photography, authentic storytelling");
    }, []);

    return (
        <PageLayout transparentHeader={true}>
            {/* Hero Section */}
            <section className="relative h-[90vh] -mt-16 w-full flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <BlurImage
                        src={heroImageUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuAdOA3mAUqDUcHv1Eijk2LLjTmE2t6rWsDLyzPK1GKFuDmz_p2KwWtjZb9SEHZNDUEQGuU5rFGpv1dOmbhc43DY512hCI_HESxYWAxWwstP9nwxKgvlJ4aQwghXEGeb6gcFT96l2Qqr924qBjaCOHngdFyGDqXWqz_p9x5Pz1SU8iNXurBKcPcJNvkvfaYekZ98lGXjLq5fC1GATlHUk1yndhG1np_noJIfm-254JrwbJ5ly_oNejJ9dO3AHooDyNRJ6HBCEAQdQK5P"}
                        alt="Dramatic landscape photography background"
                        className="w-full h-full object-cover transition-transform duration-[20s] hover:scale-105"
                        containerClassName="w-full h-full"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/40 to-black/30"></div>
                </div>
                <div className="relative z-10 container mx-auto px-4 md:px-10 max-w-[1200px] flex flex-col items-center text-center gap-8 animate-fade-in-up">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-bold uppercase tracking-wider text-white shadow-xl">
                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                        Now booking for 2026 Season
                    </div>
                    <h1 className="text-white text-5xl md:text-7xl lg:text-8xl font-black leading-[1.05] tracking-tight max-w-5xl drop-shadow-2xl">
                        Capturing Life's <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-white to-blue-200">Fleeting Moments</span>
                    </h1>
                    <p className="text-slate-200 text-lg md:text-xl font-light leading-relaxed max-w-2xl opacity-90 drop-shadow-md">
                        Award-winning photography specializing in authentic storytelling for weddings, editorials, and soulful portraits.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 mt-6 w-full justify-center">
                        <button onClick={() => document.getElementById('portfolio')?.scrollIntoView()} className="h-12 px-8 bg-white text-background-dark rounded-lg font-bold text-base hover:bg-slate-100 transition-all hover:scale-105 shadow-lg shadow-white/10">
                            View Portfolio
                        </button>
                        <button onClick={() => navigate('/services')} className="h-12 px-8 bg-transparent border border-white/20 hover:bg-white/10 text-white rounded-lg font-bold text-base transition-all backdrop-blur-sm hover:border-white/40">
                            Our Services
                        </button>
                    </div>
                </div>
                <button
                    className="absolute bottom-10 w-full flex justify-center animate-bounce-slow text-white/50 hover:text-white transition-colors cursor-pointer bg-transparent border-none appearance-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white/20"
                    onClick={() => document.getElementById('portfolio')?.scrollIntoView()}
                    aria-label="Scroll to portfolio"
                >
                    <span className="material-symbols-outlined text-5xl" aria-hidden="true">keyboard_arrow_down</span>
                </button>
            </section>

            {/* Selected Works */}
            <section id="portfolio" className="pt-24 pb-12 px-4 md:px-10 w-full bg-background-light dark:bg-background-dark relative">
                <div className="max-w-[1200px] mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
                        <div>
                            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">Selected Works</h2>
                            <p className="text-slate-600 dark:text-slate-400 max-w-lg text-lg">A curated collection of recent projects highlighting natural light and raw emotion.</p>
                        </div>
                        <Link to="/blog" className="group flex items-center gap-2 text-primary font-bold hover:text-blue-400 transition-colors text-lg">
                            View Full Portfolio
                            <span className="material-symbols-outlined text-lg transition-transform group-hover:translate-x-1" aria-hidden="true">arrow_forward</span>
                        </Link>
                    </div>
                    {loading ? (
                         <div className="h-96 flex items-center justify-center">
                            <LoadingSpinner fullScreen={false} label="Loading portfolio..." />
                         </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {portfolioItems.map((item, idx) => (
                                <PortfolioCard key={idx} item={item} />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* About / CTA */}
            <section className="pt-16 pb-32 px-4 md:px-10 bg-background-light dark:bg-background-dark relative overflow-hidden border-t border-white/5">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-surface-dark/20 to-transparent pointer-events-none"></div>
                <div className="max-w-[1000px] mx-auto text-center relative z-10">
                    <div className="mb-10">
                        <span className="material-symbols-outlined text-7xl text-primary/50" aria-hidden="true">format_quote</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl lg:text-6xl font-medium text-slate-900 dark:text-white leading-tight mb-12">
                        "Photography is the story I fail to put into words. It's about capturing the soul of the moment."
                    </h2>
                    <div className="flex flex-col items-center gap-6 mb-12">
                        <BlurImage
                            src={avatarUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuCPWoi9ZhXTrdZwbQil23_b8ljo7Qf1z7W5Ow_BGqzj3LkSekq9K0iZwIcLbT8sZEGHahKqk3uie2SWm1fel5mIHW9b72EQeaFTmLOI2siHwAT0AmEic2iBrFKA0khIANOA2T5lKu9NncRD0muI-y3gcZQtXfGi6r1ohnT5C3Ipmkq-rx3wlimjyQqZ8_wUUa8HwQxJwVTdQ7FwFSgsK45N2yGviCK1uvorMqMe8Dy6nKtjFgKI_VODBZ-bN-ODbwgAY8R1TkUR1lUx"}
                            alt="Shedrick Flowers - Lead Photographer"
                            className="w-full h-full object-cover"
                            containerClassName="w-20 h-20 rounded-full border-4 border-background-dark ring-2 ring-primary"
                        />
                        <div className="text-center">
                            <p className="text-slate-900 dark:text-white font-bold text-xl">Shedrick Flowers</p>
                            <p className="text-slate-500 text-sm uppercase tracking-wider font-bold mt-1">Lead Photographer</p>
                        </div>
                    </div>
                    <button onClick={() => navigate('/about')} className="px-8 py-3 rounded-full border border-slate-700 text-slate-300 hover:bg-white hover:text-black hover:border-white transition-all font-bold">
                        Read My Story
                    </button>
                </div>
            </section>
        </PageLayout>
    );
};

export default HomePage;
