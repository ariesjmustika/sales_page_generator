import Footer from '@/Components/Footer';
import { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowRight,
    Edit3,
    HelpCircle,
    Layout,
    MessageSquare,
    Palette,
    Smartphone,
    Sparkles,
    Zap,
    Sun,
    Moon
} from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Welcome({
    auth,
}: PageProps<{ laravelVersion: string; phpVersion: string }>) {
    const [theme, setTheme] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('theme') || 'dark';
        }
        return 'dark';
    });

    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    };

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

    return (
        <div className={`min-h-screen transition-colors duration-500 overflow-hidden font-sans selection:bg-indigo-500/30 ${theme === 'dark' ? 'bg-[#0a0a0c] text-white' : 'bg-[#F8F9FA] text-slate-900'}`}>
            <Head title="MarketAI - High-Conversion Sales Pages in Seconds" />

            {/* Background Decor */}
            <div className="pointer-events-none absolute left-1/2 top-0 h-[800px] w-full -translate-x-1/2 overflow-hidden">
                <div className={`absolute left-[-20%] top-[-10%] h-[100%] w-[50%] animate-pulse rounded-full blur-[140px] transition-colors duration-500 ${theme === 'dark' ? 'bg-indigo-600/10' : 'bg-indigo-500/5'}`} />
                <div
                    className={`absolute right-[-20%] top-[10%] h-[100%] w-[50%] animate-pulse rounded-full blur-[140px] transition-colors duration-500 ${theme === 'dark' ? 'bg-fuchsia-600/10' : 'bg-fuchsia-500/5'}`}
                    style={{ animationDelay: '2s' }}
                />
            </div>

            {/* Navbar */}
            <nav className="relative z-50 mx-auto flex max-w-7xl items-center justify-between px-4 py-6 sm:px-8 sm:py-10">
                <div className="flex items-center space-x-2 sm:space-x-3 group">
                    <div className="flex h-10 w-10 sm:h-12 sm:w-12 rotate-3 items-center justify-center rounded-xl sm:rounded-2xl bg-gradient-to-br from-indigo-600 to-fuchsia-600 shadow-2xl shadow-indigo-500/20 transition-transform group-hover:rotate-0">
                        <Zap className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    </div>
                    <span className={`text-xl sm:text-3xl font-black tracking-tighter transition-colors ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                        MarketAI
                    </span>
                </div>
                
                <div className="flex items-center space-x-3 sm:space-x-8">
                    {/* Theme Toggle */}
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={toggleTheme}
                        className={`flex h-10 w-10 items-center justify-center rounded-xl border transition-all duration-300 ${
                            theme === 'dark' 
                            ? 'border-white/10 bg-white/5 text-yellow-400' 
                            : 'border-slate-200 bg-white text-indigo-600 shadow-sm'
                        }`}
                    >
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={theme}
                                initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                                exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                                transition={{ duration: 0.3 }}
                            >
                                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                            </motion.div>
                        </AnimatePresence>
                    </motion.button>

                    {auth.user ? (
                        <Link
                            href={route('dashboard')}
                            className={`rounded-full border px-6 py-2 sm:px-8 sm:py-3 text-sm sm:text-base font-bold backdrop-blur-md transition-all ${
                                theme === 'dark'
                                ? 'border-white/10 bg-white/5 text-white hover:border-indigo-500/50 hover:bg-white/10'
                                : 'border-slate-200 bg-white text-slate-700 hover:border-indigo-500 hover:text-indigo-600 shadow-sm'
                            }`}
                        >
                            Dashboard
                        </Link>
                    ) : (
                        <div className="flex items-center space-x-3 sm:space-x-6">
                            <Link
                                href={route('login')}
                                className={`text-xs sm:text-base font-bold tracking-tight transition-colors ${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`}
                            >
                                Sign In
                            </Link>
                            <Link
                                href={route('register')}
                                className="rounded-full bg-indigo-600 px-5 py-2 sm:px-8 sm:py-3 text-xs sm:text-base font-black text-white shadow-xl shadow-indigo-600/20 transition-all hover:bg-indigo-500 active:scale-95"
                            >
                                Get Started
                            </Link>
                        </div>
                    )}
                </div>
            </nav>

            {/* Hero Section */}
            <main className="relative z-10 mx-auto max-w-7xl px-6 pb-32 pt-24 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mb-12 inline-flex items-center space-x-3 rounded-full border px-6 py-2.5 backdrop-blur-xl ${
                        theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-indigo-100 bg-indigo-50/50'
                    }`}
                >
                    <div className="h-2 w-2 animate-ping rounded-full bg-green-500" />
                    <span className={`text-sm font-black uppercase tracking-[0.2em] ${theme === 'dark' ? 'text-indigo-300' : 'text-indigo-600'}`}>
                        Next-Gen AI Generation Active
                    </span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className={`mb-10 text-5xl font-black leading-[1.1] tracking-tighter md:text-[7rem] ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}
                >
                    Build Sales Funnels <br />
                    <span className="animate-gradient-x bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-indigo-500 bg-clip-text text-transparent">
                        With Pure Magic.
                    </span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className={`mx-auto mb-16 max-w-3xl text-lg font-medium leading-relaxed md:text-2xl ${theme === 'dark' ? 'text-gray-400' : 'text-slate-600'}`}
                >
                    Transform simple product ideas into high-converting
                    sales pages in seconds. Powered by Gemini AI and crafted
                    for elite performance.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mb-32 flex flex-col items-center justify-center space-y-5 sm:flex-row sm:space-x-8 sm:space-y-0"
                >
                    <Link
                        href={route('register')}
                        className={`flex w-full items-center justify-center space-x-3 rounded-full px-12 py-5 text-2xl font-black transition-all hover:scale-105 sm:w-auto ${
                            theme === 'dark'
                            ? 'bg-white text-black shadow-white/10 shadow-2xl'
                            : 'bg-indigo-600 text-white shadow-indigo-600/20 shadow-2xl hover:bg-indigo-700'
                        }`}
                    >
                        <span>Try MarketAI Free</span>
                        <ArrowRight className="h-6 w-6" />
                    </Link>
                    <Link 
                        href={route('login')}
                        className={`w-full rounded-full border px-12 py-5 text-2xl font-black backdrop-blur-md transition-all text-center sm:w-auto ${
                            theme === 'dark' ? 'border-white/10 bg-white/5 hover:bg-white/10' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 shadow-sm'
                        }`}
                    >
                        Live Demo
                    </Link>
                </motion.div>

                {/* Features Matrix */}
                <div className="grid gap-8 text-left md:grid-cols-3">
                    <FeatureBlock
                        theme={theme}
                        icon={<Zap className="h-8 w-8 text-indigo-500" />}
                        title="Dual-Engine AI"
                        description="Powered by Gemini 2.5 & 2.0 with auto-fallback. Reliability meets world-class copywriting."
                    />
                    <FeatureBlock
                        theme={theme}
                        icon={<Edit3 className="h-8 w-8 text-fuchsia-500" />}
                        title="Magic Rewrite"
                        description="Highlight any text and let our AI expand, shorten, or change its tone to be more persuasive instantly."
                    />
                    <FeatureBlock
                        theme={theme}
                        icon={<MessageSquare className="h-8 w-8 text-green-500" />}
                        title="WA Integration"
                        description="One-click lead capture. Convert visitors directly to WhatsApp with automated custom messages."
                    />
                    <FeatureBlock
                        theme={theme}
                        icon={<Palette className="h-8 w-8 text-yellow-500" />}
                        title="Theme Engine"
                        description="Switch between Modern, Dark Tech, and Minimalist styles instantly. Every theme is conversion-optimized."
                    />
                    <FeatureBlock
                        theme={theme}
                        icon={<Layout className="h-8 w-8 text-blue-500" />}
                        title="Visual Builder"
                        description="What you see is what you get. Edit copy, manage sections, and preview mobile layouts in one view."
                    />
                    <FeatureBlock
                        theme={theme}
                        icon={<HelpCircle className="h-8 w-8 text-orange-500" />}
                        title="Smart Sections"
                        description="Instantly generate FAQ and Testimonial blocks with AI to boost social proof and trust."
                    />
                </div>

                {/* Tech Stack Badge */}
                <div className={`mt-40 flex flex-col items-center border-t pt-20 ${theme === 'dark' ? 'border-white/5' : 'border-slate-200'}`}>
                    <span className="mb-12 text-xs font-black uppercase tracking-[0.4em] text-gray-500">
                        Powering The Future With Elite Infrastructure
                    </span>
                    <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-10 px-4 transition-all duration-700">
                        <TechLogo 
                            theme={theme}
                            src="https://laravel.com/img/logomark.min.svg" 
                            label="Laravel" 
                            color="hover:text-[#FF2D20]"
                        />
                        <TechLogo 
                            theme={theme}
                            src="https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg" 
                            label="React" 
                            color="hover:text-[#61DAFB]"
                        />
                        <div className={`group flex items-center space-x-3 text-2xl font-bold transition-all duration-300 ${theme === 'dark' ? 'text-gray-500 hover:text-white' : 'text-slate-400 hover:text-slate-900'}`}>
                            <Sparkles className="h-8 w-8 text-indigo-500 transition-transform group-hover:scale-110" />
                            <span>Gemini AI</span>
                        </div>
                        <div className={`group flex items-center space-x-3 text-2xl font-bold transition-all duration-300 ${theme === 'dark' ? 'text-gray-500 hover:text-white' : 'text-slate-400 hover:text-slate-900'}`}>
                            <svg className="h-8 w-8 transition-transform group-hover:scale-110" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"/><path d="M15 13H9a1 1 0 0 1 0-2h6a1 1 0 0 1 0 2z"/>
                            </svg>
                            <span>Railway</span>
                        </div>
                        <TechLogo 
                            theme={theme}
                            src="https://neon.tech/brand/neon-logo-dark-color.svg" 
                            label="Neon DB" 
                            color="hover:text-[#00E599]"
                        />
                    </div>
                </div>
            </main>

            <Footer />

            <style
                dangerouslySetInnerHTML={{
                    __html: `
                @keyframes gradient-x {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                .animate-gradient-x {
                    background-size: 200% auto;
                    animation: gradient-x 5s ease infinite;
                }
            `,
                }}
            />
        </div>
    );
}

function TechLogo({ 
    src, 
    label, 
    color,
    theme,
    className = "" 
}: { 
    src: string; 
    label: string; 
    color: string;
    theme: string;
    className?: string;
}) {
    return (
        <div className={`group flex items-center space-x-3 text-2xl font-bold transition-all duration-300 ${theme === 'dark' ? 'text-gray-500 hover:text-white' : 'text-slate-400 hover:text-slate-900'} ${color}`}>
            <img
                src={src}
                className={`w-8 h-8 transition-all duration-500 grayscale group-hover:grayscale-0 group-hover:scale-110 ${className}`}
            />
            <span className="group-hover:translate-x-1 transition-transform">{label}</span>
        </div>
    );
}

function FeatureBlock({
    icon,
    title,
    description,
    theme
}: {
    icon: React.ReactNode;
    title: string;
    description: string;
    theme: string;
}) {
    return (
        <div className={`group rounded-[3rem] border p-10 backdrop-blur-sm transition-all ${
            theme === 'dark'
            ? 'border-white/5 bg-white/[0.03] hover:border-indigo-500/30 hover:bg-white/[0.06]'
            : 'border-slate-200 bg-white hover:border-indigo-500 hover:shadow-xl hover:shadow-indigo-500/5'
        }`}>
            <div className={`mb-8 flex h-16 w-16 items-center justify-center rounded-3xl transition-transform duration-500 group-hover:scale-110 ${
                theme === 'dark' ? 'bg-white/5' : 'bg-slate-50 border border-slate-100'
            }`}>
                {icon}
            </div>
            <h3 className={`mb-4 text-3xl font-black tracking-tighter transition-colors ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                {title}
            </h3>
            <p className={`font-medium leading-relaxed ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>
                {description}
            </p>
        </div>
    );
}
