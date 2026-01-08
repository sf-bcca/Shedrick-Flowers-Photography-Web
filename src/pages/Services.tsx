import React, { useState, useEffect } from 'react';
import { PageLayout } from '../components/Layout';
import { BlurImage } from '../components/BlurImage';
import LoadingSpinner from '../components/LoadingSpinner';
import { ServiceCard } from '../components/ServiceCard';
import { fetchData } from '../services/supabaseClient';
import { ServiceTier } from '../types';
import { getSessionStorage } from '../services/storage';

const FALLBACK_SERVICES: ServiceTier[] = [
    {
        title: "Portrait Session",
        description: "Intimate single or couple portraits capturing authentic moments in natural or studio settings.",
        price: "500",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAmHoj0vChTuwRwtj4WMJB_K9TL4vBvRxb_58w3tE5hI_0c3EwhXM9rL2oijC2VuLBvc_jwud3uawTIwKumgLE2K5Q4dE_Od4MedX3mtrYD3GSqkQvPH8yIXSM3FL_b4p2JWH8MyXuYXMZzweYwVq9gCKCYw7w604pT9jzzQRO3fkWympgDWXcKtFKKShQam2j3w3IU7Rx76HyQGOGoj7IqOVdmtn09BJDlOUF-ZtB5BCvw3xtLyABS8s6G_2gxQd2bq-C1T5E9zmod"
    },
    {
        title: "Wedding Coverage",
        description: "Full-day wedding photography including ceremony, reception, and candid moments with your loved ones.",
        price: "2500",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDj4Qc39c1Bdpp5z1iM8AGRx9atflrxxF0IxJLEXqjGcOlUTBdYyuCCLiBT5p7Bd8a9ONhVvlMbqThgup4DCT-kz2g1gL0EtnxEOePnl1oSuS77mOCW3rZV2H4ClPddn2JeF5Ir5rnxu_ND_XSa6NcbiJ0Xo7TgNTZzp7Q-L9I3xB_XW0Jv0OR9ysr5wGf2UXK5DBDe0J9WRWo-QawcHZAYPxECIb6qgxyQej94lIc4ImRwsDDHDAbPeJ65kCuC9WSqZioqEEypm2zC"
    },
    {
        title: "Event Photography",
        description: "Professional coverage of corporate events, parties, and special occasions with quick turnaround.",
        price: "1200",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC6dwKikfC342afi1MaVXiwZ0NcdwRthX9XaX-XeqTUmq19TtL9cuUn8i3bUdl6O1OpjLtGCMJU2VSy7e6MQ4NFK3dEz8P25bultf_M3ZJOn1geKTDaeHMN0n8Zbs8xQQe2iDspgYevSCg7k7XNtL9CVXHZP9RWRnYyfVmk5izk4qBQvKItg4w0pPakHP0U5epcpKlwbzReOM3Ls6Jxuy9djYvzP8S1jxHDykpmb1ZrzZywwQcJf6iJdjUup9_Bb4yA8p7sJ6rS7Cf-"
    },
    {
        title: "Commercial / Product",
        description: "High-end product photography and commercial shoots for brands and businesses.",
        price: "Custom",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBPKNL63uKUTPIARy2j1jcjGCeVA-LiZt3b4eqYu3-XxAmXdLaNAmVjADGzs6TyZQiLwYiIPU8XVrND09Q_GG5c6IMiOoSXrlAkXrK-NNrTZSWUCP-_dY-mVe44uFRGQC6RJijoDDy4v9CrXFD4bFl-FwQ9rClXT_RfDKWWKMW7zclRInwFQRh8uGpVQXXqNhByispoVF0az9WLhBJ6NwpkJWUx3G_7EQAjwwjOuzoujFfogBJElD0T_GuIn3ueCNxkbEm6WbX_rT9Y"
    },
    {
        title: "Family Session",
        description: "Warm, candid family portraits that capture the unique dynamics and love within your family.",
        price: "750",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCPWoi9ZhXTrdZwbQil23_b8ljo7Qf1z7W5Ow_BGqzj3LkSekq9K0iZwIcLbT8sZEGHahKqk3uie2SWm1fel5mIHW9b72EQeaFTmLOI2siHwAT0AmEic2iBrFKA0khIANOA2T5lKu9NncRD0muI-y3gcZQtXfGi6r1ohnT5C3Ipmkq-rx3wlimjyQqZ8_wUUa8HwQxJwVTdQ7FwFSgsK45N2yGviCK1uvorMqMe8Dy6nKtjFgKI_VODBZ-bN-ODbwgAY8R1TkUR1lUx"
    },
    {
        title: "Editorial Shoot",
        description: "Magazine-style editorial photography for models, designers, and creative collaborations.",
        price: "1800",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAdOA3mAUqDUcHv1Eijk2LLjTmE2t6rWsDLyzPK1GKFuDmz_p2KwWtjZb9SEHZNDUEQGuU5rFGpv1dOmbhc43DY512hCI_HESxYWAxWwstP9nwxKgvlJ4aQwghXEGeb6gcFT96l2Qqr924qBjaCOHngdFyGDqXWqz_p9x5Pz1SU8iNXurBKcPcJNvkvfaYekZ98lGXjLq5fC1GATlHUk1yndhG1np_noJIfm-254JrwbJ5ly_oNejJ9dO3AHooDyNRJ6HBCEAQdQK5P"
    }
];

const FEATURE_COMPARISON_DATA = [
    { f: "Photo Resolution", s: "High Res (24MP)", p: "Ultra High Res (42MP+)" },
    { f: "Retouched Images", s: "20 Images", p: "50+ Images" },
    { f: "Online Gallery Duration", s: "6 Months", p: "Lifetime" },
    { f: "Print Release", s: "Personal Use", p: "Full Commercial" },
    { f: "Turnaround Time", s: "3 Weeks", p: "1 Week" },
];

const ServicesPage = () => {
    // Lazy initialize from session storage
    const [services, setServices] = useState<ServiceTier[]>(() =>
        getSessionStorage<ServiceTier[]>('servicesData') || []
    );

    useEffect(() => {
        // If loaded from cache, skip fetch
        if (services.length > 0) return;

        // Optimize: Select only necessary fields for the grid
        fetchData('services', 'id, title, description, price, image').then((data: any) => {
            // If no data from Supabase, use fallback mock data
            if (data && data.length > 0) {
                setServices(data);
                // Cache the fresh data
                sessionStorage.setItem('servicesData', JSON.stringify(data));
            } else {
                // Fallback mock data
                setServices(FALLBACK_SERVICES);
            }
        });
    }, []);

    return (
        <PageLayout>
             {/* Header Hero */}
             <section className="relative px-4 md:px-10 lg:px-40 py-10">
                <div className="relative w-full rounded-2xl overflow-hidden min-h-[500px] flex items-center justify-center text-center p-8 group">
                    <div className="absolute inset-0 w-full h-full">
                        <BlurImage
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDj4Qc39c1Bdpp5z1iM8AGRx9atflrxxF0IxJLEXqjGcOlUTBdYyuCCLiBT5p7Bd8a9ONhVvlMbqThgup4DCT-kz2g1gL0EtnxEOePnl1oSuS77mOCW3rZV2H4ClPddn2JeF5Ir5rnxu_ND_XSa6NcbiJ0Xo7TgNTZzp7Q-L9I3xB_XW0Jv0OR9ysr5wGf2UXK5DBDe0J9WRWo-QawcHZAYPxECIb6qgxyQej94lIc4ImRwsDDHDAbPeJ65kCuC9WSqZioqEEypm2zC"
                            alt="Services Hero Background"
                            className="w-full h-full object-cover transition-transform duration-[30s] hover:scale-110"
                            containerClassName="w-full h-full"
                        />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/60 to-background-dark/30"></div>
                    <div className="relative z-10 flex flex-col gap-6 max-w-3xl animate-fade-in-up">
                        <span className="text-primary font-bold uppercase tracking-widest text-sm">Packages & Pricing</span>
                        <h1 className="text-white text-4xl md:text-6xl font-black leading-tight tracking-tight">Curated Photography <br/>Packages</h1>
                        <p className="text-gray-200 text-lg md:text-xl font-light leading-relaxed">From intimate portraits to grand celebrations, choose the package that fits your story perfectly.</p>
                    </div>
                </div>
            </section>

            {/* Services Grid */}
            <section className="py-16 px-4 md:px-10 lg:px-40 bg-background-dark">
                <div className="mx-auto max-w-[1280px]">
                    <div className="mb-12 flex flex-col gap-3">
                        <h2 className="text-white text-3xl md:text-4xl font-bold">Select Your Session</h2>
                        <div className="h-1 w-20 bg-primary rounded-full"></div>
                    </div>
                    {services.length === 0 ? (
                        <div className="flex justify-center">
                            <LoadingSpinner fullScreen={false} label="Loading services..." />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {services.map((item, idx) => (
                                <ServiceCard key={item.id || idx} item={item} />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Feature Comparison */}
            <section className="py-20 bg-[#0d1119]">
                <div className="px-4 md:px-10 lg:px-40 mx-auto max-w-[1280px]">
                    <div className="text-center mb-16">
                        <h2 className="text-white text-3xl md:text-4xl font-bold mb-4">Compare Tiers</h2>
                        <p className="text-text-secondary">Choose the level of service that best fits your needs.</p>
                    </div>
                    <div className="overflow-x-auto rounded-2xl border border-[#243047] bg-surface-dark shadow-2xl">
                        <table className="w-full text-left text-sm text-gray-400">
                            <thead className="bg-[#1e2738] text-xs uppercase text-white">
                                <tr>
                                    <th className="px-8 py-6 font-bold tracking-wider w-1/3" scope="col">Features</th>
                                    <th className="px-8 py-6 font-bold tracking-wider text-center w-1/3" scope="col">Standard</th>
                                    <th className="px-8 py-6 font-bold tracking-wider text-center text-primary w-1/3" scope="col">Premium</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#243047]">
                                {FEATURE_COMPARISON_DATA.map((row, i) => (
                                    <tr key={i} className="hover:bg-white/5 transition-colors">
                                        <td className="px-8 py-5 font-medium text-white">{row.f}</td>
                                        <td className="px-8 py-5 text-center">{row.s}</td>
                                        <td className="px-8 py-5 text-center font-bold text-white bg-primary/5">{row.p}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

             {/* FAQ Section */}
             <section className="py-20 px-4 md:px-10 lg:px-40 bg-background-dark">
                <div className="mx-auto max-w-[800px] flex flex-col gap-10">
                    <h2 className="text-white text-3xl font-bold text-center">Frequently Asked Questions</h2>
                    <div className="flex flex-col gap-4">
                        <details className="group bg-surface-dark p-6 rounded-xl cursor-pointer border border-white/5 hover:border-primary/50 transition-all open:ring-1 open:ring-primary/20 shadow-lg">
                            <summary className="flex justify-between items-center font-bold text-white text-lg select-none">
                                <span>Do you travel for weddings?</span>
                                <span className="material-symbols-outlined text-gray-400 group-open:rotate-180 transition-transform" aria-hidden="true">expand_more</span>
                            </summary>
                            <div className="mt-4 text-text-secondary leading-relaxed border-t border-white/5 pt-4">Yes! While I am based in New York, I love to travel. For destination weddings, travel fees including flight and accommodation will be included in a custom quote.</div>
                        </details>
                        <details className="group bg-surface-dark p-6 rounded-xl cursor-pointer border border-white/5 hover:border-primary/50 transition-all open:ring-1 open:ring-primary/20 shadow-lg">
                            <summary className="flex justify-between items-center font-bold text-white text-lg select-none">
                                <span>How do I book a date?</span>
                                <span className="material-symbols-outlined text-gray-400 group-open:rotate-180 transition-transform" aria-hidden="true">expand_more</span>
                            </summary>
                            <div className="mt-4 text-text-secondary leading-relaxed border-t border-white/5 pt-4">To secure your date, a signed contract and a 30% non-refundable retainer are required. The remaining balance is due 2 weeks before the event date.</div>
                        </details>
                        <details className="group bg-surface-dark p-6 rounded-xl cursor-pointer border border-white/5 hover:border-primary/50 transition-all open:ring-1 open:ring-primary/20 shadow-lg">
                            <summary className="flex justify-between items-center font-bold text-white text-lg select-none">
                                <span>What equipment do you use?</span>
                                <span className="material-symbols-outlined text-gray-400 group-open:rotate-180 transition-transform" aria-hidden="true">expand_more</span>
                            </summary>
                            <div className="mt-4 text-text-secondary leading-relaxed border-t border-white/5 pt-4">I shoot with professional Sony mirrorless cameras (A7R V) and a collection of prime G-Master lenses to ensure the highest quality in low light.</div>
                        </details>
                    </div>
                </div>
            </section>
        </PageLayout>
    );
};

export default ServicesPage;
