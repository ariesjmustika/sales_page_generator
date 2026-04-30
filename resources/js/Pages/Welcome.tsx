import Footer from '@/Components/Footer';
import { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
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
} from 'lucide-react';

export default function Welcome({
    auth,
}: PageProps<{ laravelVersion: string; phpVersion: string }>) {
    return (
        <>
            <Head title="MarketAI - High-Conversion Sales Pages in Seconds" />

            <div className="min-h-screen overflow-hidden bg-[#0a0a0c] font-sans text-white selection:bg-indigo-500/30">
                {/* Background Blobs */}
                <div className="pointer-events-none absolute left-1/2 top-0 h-[800px] w-full -translate-x-1/2 overflow-hidden">
                    <div className="absolute left-[-20%] top-[-10%] h-[100%] w-[50%] animate-pulse rounded-full bg-indigo-600/10 blur-[140px]" />
                    <div
                        className="absolute right-[-20%] top-[10%] h-[100%] w-[50%] animate-pulse rounded-full bg-fuchsia-600/10 blur-[140px]"
                        style={{ animationDelay: '2s' }}
                    />
                </div>

                {/* Navbar */}
                <nav className="relative z-50 mx-auto flex max-w-7xl items-center justify-between px-8 py-10">
                    <div className="flex items-center space-x-3">
                        <div className="flex h-12 w-12 rotate-3 cursor-pointer items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-fuchsia-600 shadow-2xl shadow-indigo-500/20 transition-transform group-hover:rotate-0">
                            <Zap className="h-6 w-6 text-white" />
                        </div>
                        <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-3xl font-black tracking-tighter text-transparent">
                            MarketAI
                        </span>
                    </div>
                    <div className="flex items-center space-x-8">
                        {auth.user ? (
                            <Link
                                href={route('dashboard')}
                                className="rounded-full border border-white/10 bg-white/5 px-8 py-3 font-bold backdrop-blur-md transition-all hover:border-indigo-500/50 hover:bg-white/10"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route('login')}
                                    className="font-bold tracking-tight text-gray-400 transition-colors hover:text-white"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="rounded-full bg-indigo-600 px-8 py-3 font-black shadow-xl shadow-indigo-600/20 transition-all hover:bg-indigo-500 active:scale-95"
                                >
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>
                </nav>

                {/* Hero Section */}
                <main className="relative z-10 mx-auto max-w-7xl px-6 pb-32 pt-24 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-12 inline-flex items-center space-x-3 rounded-full border border-white/10 bg-white/5 px-6 py-2.5 backdrop-blur-xl"
                    >
                        <div className="h-2 w-2 animate-ping rounded-full bg-green-500" />
                        <span className="text-sm font-black uppercase tracking-[0.2em] text-indigo-300">
                            Next-Gen AI Generation Active
                        </span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="mb-10 text-7xl font-black leading-[1] tracking-tighter md:text-[7rem]"
                    >
                        Build Sales Funnels <br />
                        <span className="animate-gradient-x bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-indigo-400 bg-clip-text text-transparent">
                            With Pure Magic.
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mx-auto mb-16 max-w-3xl text-xl font-medium leading-relaxed text-gray-400 md:text-2xl"
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
                            className="flex w-full items-center justify-center space-x-3 rounded-full bg-white px-12 py-5 text-2xl font-black text-black shadow-2xl shadow-white/10 transition-all hover:scale-110 sm:w-auto"
                        >
                            <span>Try MarketAI Free</span>
                            <ArrowRight className="h-6 w-6" />
                        </Link>
                        <button className="w-full rounded-full border border-white/10 bg-white/5 px-12 py-5 text-2xl font-black backdrop-blur-md transition-all hover:bg-white/10 sm:w-auto">
                            Live Demo
                        </button>
                    </motion.div>

                    {/* Features Matrix */}
                    <div className="grid gap-8 text-left md:grid-cols-3">
                        <FeatureBlock
                            icon={<Zap className="h-8 w-8 text-indigo-400" />}
                            title="Dual-Engine AI"
                            description="Powered by Gemini 2.5 & 2.0 with auto-fallback. Reliability meets world-class copywriting."
                        />
                        <FeatureBlock
                            icon={
                                <Edit3 className="h-8 w-8 text-fuchsia-400" />
                            }
                            title="Magic Rewrite"
                            description="Highlight any text and let our AI expand, shorten, or change its tone to be more persuasive instantly."
                        />
                        <FeatureBlock
                            icon={
                                <MessageSquare className="h-8 w-8 text-green-400" />
                            }
                            title="WA Integration"
                            description="One-click lead capture. Convert visitors directly to WhatsApp with automated custom messages."
                        />
                        <FeatureBlock
                            icon={
                                <Palette className="h-8 w-8 text-yellow-400" />
                            }
                            title="Theme Engine"
                            description="Switch between Modern, Dark Tech, and Minimalist styles instantly. Every theme is conversion-optimized."
                        />
                        <FeatureBlock
                            icon={<Layout className="h-8 w-8 text-blue-400" />}
                            title="Visual Builder"
                            description="What you see is what you get. Edit copy, manage sections, and preview mobile layouts in one view."
                        />
                        <FeatureBlock
                            icon={
                                <HelpCircle className="h-8 w-8 text-orange-400" />
                            }
                            title="Smart Sections"
                            description="Instantly generate FAQ and Testimonial blocks with AI to boost social proof and trust."
                        />
                    </div>

                    {/* Tech Stack Badge */}
                    <div className="mt-40 flex flex-col items-center border-t border-white/5 pt-20">
                        <span className="mb-10 text-xs font-black uppercase tracking-[0.4em] text-gray-500">
                            Powering The Future With
                        </span>
                        <div className="flex flex-wrap items-center justify-center gap-12 opacity-40 grayscale transition-all duration-700 hover:grayscale-0">
                            <div className="flex items-center space-x-3 text-2xl font-bold">
                                <img
                                    src="https://laravel.com/img/logomark.min.svg"
                                    className="w-8"
                                />{' '}
                                <span>Laravel</span>
                            </div>
                            <div className="flex items-center space-x-3 text-2xl font-bold">
                                <img
                                    src="https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg"
                                    className="w-10"
                                />{' '}
                                <span>React</span>
                            </div>
                            <div className="flex items-center space-x-3 text-2xl font-bold">
                                <Sparkles className="text-indigo-400" />{' '}
                                <span>Gemini AI</span>
                            </div>
                            <div className="flex items-center space-x-3 text-2xl font-bold">
                                <Smartphone className="text-fuchsia-400" />{' '}
                                <span>Responsive</span>
                            </div>
                        </div>
                    </div>
                </main>

                <Footer />
            </div>

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
        </>
    );
}

function FeatureBlock({
    icon,
    title,
    description,
}: {
    icon: React.ReactNode;
    title: string;
    description: string;
}) {
    return (
        <div className="group rounded-[3rem] border border-white/5 bg-white/[0.03] p-10 backdrop-blur-sm transition-all hover:border-indigo-500/30 hover:bg-white/[0.06]">
            <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-3xl bg-white/5 transition-transform duration-500 group-hover:scale-110">
                {icon}
            </div>
            <h3 className="mb-4 text-3xl font-black tracking-tighter">
                {title}
            </h3>
            <p className="font-medium leading-relaxed text-gray-400">
                {description}
            </p>
        </div>
    );
}
