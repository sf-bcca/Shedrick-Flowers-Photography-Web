import React from 'react';
import { PageLayout } from '../components/Layout';
import { Link } from 'react-router-dom';

const AboutPage = () => {
    return (
        <PageLayout>
             <div className="w-full max-w-7xl mx-auto px-4 md:px-10 lg:px-20 py-12 flex flex-col gap-20">
                {/* Hero Section: Split Layout */}
                <section className="flex flex-col lg:flex-row gap-12 lg:gap-24 items-center justify-center min-h-[60vh] animate-fade-in-up">
                    <div className="w-full lg:w-5/12 relative group perspective-1000">
                        <div className="absolute -inset-4 bg-gradient-to-tr from-primary to-purple-600 rounded-3xl blur-xl opacity-30 group-hover:opacity-60 transition duration-1000 group-hover:duration-200"></div>
                        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl shadow-2xl rotate-y-12">
                            <img
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAmHoj0vChTuwRwtj4WMJB_K9TL4vBvRxb_58w3tE5hI_0c3EwhXM9rL2oijC2VuLBvc_jwud3uawTIwKumgLE2K5Q4dE_Od4MedX3mtrYD3GSqkQvPH8yIXSM3FL_b4p2JWH8MyXuYXMZzweYwVq9gCKCYw7w604pT9jzzQRO3fkWympgDWXcKtFKKShQam2j3w3IU7Rx76HyQGOGoj7IqOVdmtn09BJDlOUF-ZtB5BCvw3xtLyABS8s6G_2gxQd2bq-C1T5E9zmod"
                                alt="Shedrick Flowers Portrait"
                                className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
                            />
                        </div>
                        <div className="absolute -bottom-10 -left-10 bg-surface-dark p-6 rounded-2xl border border-slate-700 shadow-2xl hidden md:flex flex-col gap-2 animate-bounce-slow">
                            <div className="flex gap-1 text-primary">
                                <span className="material-symbols-outlined fill-current">star</span>
                                <span className="material-symbols-outlined fill-current">star</span>
                                <span className="material-symbols-outlined fill-current">star</span>
                                <span className="material-symbols-outlined fill-current">star</span>
                                <span className="material-symbols-outlined fill-current">star</span>
                            </div>
                            <span className="text-white font-bold text-sm">Top Rated MS Photographer</span>
                        </div>
                    </div>
                    <div className="w-full lg:w-7/12 flex flex-col gap-8 text-center lg:text-left">
                        <div className="flex flex-col gap-6">
                            <div className="flex items-center gap-3 text-primary uppercase tracking-widest text-xs font-bold justify-center lg:justify-start">
                                <span className="w-12 h-[2px] bg-primary"></span>
                                About the Artist
                            </div>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight tracking-[-0.033em]">Capturing Life's <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-white">Unscripted</span> Moments.</h1>
                            <div className="text-slate-600 dark:text-slate-300 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto lg:mx-0 flex flex-col gap-4">
                                <p>
                                    My heart beats in the rhythm of Grenada, MS, where I’ve woven my passion for photography into the fabric of countless lives for over a decade. With every click of the shutter, I become a witness to life’s most beautiful chapters: the seasoned wisdom etched in a senior’s smile, the love story unfolding in a couple’s gaze, the unrestrained joy erupting at a celebration. But more than just capturing moments, I capture emotions. I paint with light, sculpting memories that shimmer with laughter, glisten with tears, and echo with the unfiltered melody of the soul.
                                </p>
                                <p>
                                    Whether you’re a senior embracing a new chapter, a family etching your love in a timeless portrait, or planning an event that promises to ignite a lifetime of stories, I invite you to join me on this journey of light and memory. Let’s weave your story, together.
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-6 justify-center lg:justify-start pt-4">
                            <Link to="/contact" className="flex h-12 px-10 items-center justify-center rounded-lg bg-primary hover:bg-blue-600 text-white text-base font-bold transition-all hover:-translate-y-1 shadow-lg shadow-primary/30">
                                Let's Talk
                            </Link>
                            <div className="flex items-center gap-4 lg:border-l border-slate-200 dark:border-slate-800 lg:pl-6">
                                <a className="text-slate-400 hover:text-primary transition-colors transform hover:scale-110 p-2 border border-transparent hover:border-slate-700 rounded-full" href="#"><span className="material-symbols-outlined">camera_alt</span></a>
                                <span className="text-sm font-medium text-slate-500">My Gear Bag</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Stats */}
                <section className="w-full border-y border-slate-200 dark:border-slate-800 py-16">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
                        <div className="flex flex-col items-center gap-2">
                            <span className="text-5xl md:text-6xl font-black tracking-tight text-white bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-500">12+</span>
                            <span className="text-xs font-bold uppercase tracking-widest text-primary">Years Active</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <span className="text-5xl md:text-6xl font-black tracking-tight text-white bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-500">500+</span>
                            <span className="text-xs font-bold uppercase tracking-widest text-primary">Shoots</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <span className="text-5xl md:text-6xl font-black tracking-tight text-white bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-500">15</span>
                            <span className="text-xs font-bold uppercase tracking-widest text-primary">Awards</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <span className="text-5xl md:text-6xl font-black tracking-tight text-white bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-500">100%</span>
                            <span className="text-xs font-bold uppercase tracking-widest text-primary">Satisfaction</span>
                        </div>
                    </div>
                </section>

                {/* Testimonials */}
                <section className="w-full py-10">
                    <div className="flex flex-col gap-12">
                        <div className="flex items-center justify-between border-b border-white/10 pb-6">
                            <h3 className="text-3xl font-bold text-white">Latest Words</h3>
                            <a className="text-sm text-primary hover:text-white transition-colors flex items-center gap-1 font-bold uppercase tracking-wide" href="#">
                                View all <span className="material-symbols-outlined text-sm">arrow_forward</span>
                            </a>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="flex flex-col gap-8 rounded-2xl bg-surface-light dark:bg-[#1A202C] p-10 transition-all hover:bg-white dark:hover:bg-[#202837] border border-transparent hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5">
                                <div className="flex items-center gap-4">
                                    <img
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCvj9gjErwbye8NeL4fDM3FwLax1Uoh2rCm1SW4wVq8DQCrglJN8oHnGO6QHUNuZfY5tJORlVE3rF81EOkZThcheVeoHdvBQPud-cwrTDoKFjIJ4Vwb0g5x6ETCxZnjKS2Kho-5qxdRc0TIcdP7rnt6Hr9EPdr-Uw5fWhU-L7-QYAHy-Vh7MqVYr5grfLNapEM3ergSkPboWP5wU87QGWh_xwSA-YoaioV45wVER7SFgeO0tqqFayCbYClVWXU05E3nybNqG-hPS7Xf"
                                        alt="Sarah Jenkins"
                                        loading="lazy"
                                        className="size-14 rounded-full object-cover ring-2 ring-primary/20"
                                    />
                                    <div>
                                        <p className="text-lg font-bold text-slate-900 dark:text-white">Sarah Jenkins</p>
                                        <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Wedding Photography</p>
                                    </div>
                                    <div className="ml-auto flex text-yellow-500 gap-0.5">
                                        {[1,2,3,4,5].map(i => <span key={i} className="material-symbols-outlined text-[20px] fill-current">star</span>)}
                                    </div>
                                </div>
                                <p className="text-slate-700 dark:text-slate-300 text-xl italic leading-relaxed">"Shedrick has an incredible eye for detail. The session felt so natural and the results were breathtaking. I've never felt more comfortable in front of a camera."</p>
                            </div>
                            <div className="flex flex-col gap-8 rounded-2xl bg-surface-light dark:bg-[#1A202C] p-10 transition-all hover:bg-white dark:hover:bg-[#202837] border border-transparent hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5">
                                <div className="flex items-center gap-4">
                                    <img
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuB2_HmFxEpRY12XdjgeZuNL2vLwftaxbtBkmOx9HZI3xzbCbC86lVaaQtZUQ8NnCE3jPWOWWwF77MeyTLRzX8qkXwhXe73aFMEGlEQJuXRLp94n910iAQ96HxJdONFBNUnhuzq5gk6__5ovvjJFs9i8GxKCMmR028LQ9E_8QBaaCc8d1Trrf71s3-tS-IYMwuCTAs4aygE8m1xfokwQboG3PTBoOnt4vtDfgE9ncZ-gDQmEGqsGmkh082v7f7gGGPqvR4T-gt3I-LlL"
                                        alt="Mark Thompson"
                                        loading="lazy"
                                        className="size-14 rounded-full object-cover ring-2 ring-primary/20"
                                    />
                                    <div>
                                        <p className="text-lg font-bold text-slate-900 dark:text-white">Mark Thompson</p>
                                        <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Brand Editorial</p>
                                    </div>
                                    <div className="ml-auto flex text-yellow-500 gap-0.5">
                                        {[1,2,3,4,5].map(i => <span key={i} className="material-symbols-outlined text-[20px] fill-current">star</span>)}
                                    </div>
                                </div>
                                <p className="text-slate-700 dark:text-slate-300 text-xl italic leading-relaxed">"Professional, creative, and efficient. The photos elevated our brand identity significantly. Highly recommended for any commercial work."</p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </PageLayout>
    );
};

export default AboutPage;
