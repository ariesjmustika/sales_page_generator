import { Link, Head } from '@inertiajs/react';
import Footer from '@/Components/Footer';
import { PageProps } from '@/types';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Zap, Shield, BarChart3, Globe, MessageSquare, Edit3, Layout, Palette, HelpCircle, Smartphone } from 'lucide-react';

export default function Welcome({ auth }: PageProps<{ laravelVersion: string, phpVersion: string }>) {
    return (
        <>
            <Head title="MarketAI - High-Conversion Sales Pages in Seconds" />
            
            <div className="bg-[#0a0a0c] text-white min-h-screen overflow-hidden selection:bg-indigo-500/30 font-sans">
                {/* Background Blobs */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] overflow-hidden pointer-events-none">
                    <div className="absolute top-[-10%] left-[-20%] w-[50%] h-[100%] bg-indigo-600/10 blur-[140px] rounded-full animate-pulse" />
                    <div className="absolute top-[10%] right-[-20%] w-[50%] h-[100%] bg-fuchsia-600/10 blur-[140px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
                </div>

                {/* Navbar */}
                <nav className="relative z-50 flex items-center justify-between px-8 py-10 max-w-7xl mx-auto">
                    <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-fuchsia-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-500/20 rotate-3 group-hover:rotate-0 transition-transform cursor-pointer">
                            <Zap className="text-white w-6 h-6" />
                        </div>
                        <span className="text-3xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">MarketAI</span>
                    </div>
                    <div className="flex items-center space-x-8">
                        {auth.user ? (
                            <Link
                                href={route('dashboard')}
                                className="px-8 py-3 bg-white/5 border border-white/10 rounded-full font-bold hover:bg-white/10 hover:border-indigo-500/50 transition-all backdrop-blur-md"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link href={route('login')} className="text-gray-400 hover:text-white transition-colors font-bold tracking-tight">
                                    Sign In
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="px-8 py-3 bg-indigo-600 rounded-full font-black hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20 active:scale-95"
                                >
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>
                </nav>

                {/* Hero Section */}
                <main className="relative z-10 pt-24 pb-32 px-6 max-w-7xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center space-x-3 px-6 py-2.5 bg-white/5 border border-white/10 rounded-full mb-12 backdrop-blur-xl"
                    >
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
                        <span className="text-sm font-black text-indigo-300 uppercase tracking-[0.2em]">Next-Gen AI Generation Active</span>
                    </motion.div>

                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-7xl md:text-[7rem] font-black mb-10 leading-[1] tracking-tighter"
                    >
                        Build Sales Funnels <br />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-indigo-400 animate-gradient-x">
                            With Pure Magic.
                        </span>
                    </motion.h1>

                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto mb-16 leading-relaxed font-medium"
                    >
                        Transform simple product ideas into high-converting sales pages in seconds. Powered by Gemini AI and crafted for elite performance.
                    </motion.p>

                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex flex-col sm:flex-row items-center justify-center space-y-5 sm:space-y-0 sm:space-x-8 mb-32"
                    >
                        <Link
                            href={route('register')}
                            className="w-full sm:w-auto px-12 py-5 bg-white text-black rounded-full text-2xl font-black hover:scale-110 transition-all flex items-center justify-center space-x-3 shadow-2xl shadow-white/10"
                        >
                            <span>Try MarketAI Free</span>
                            <ArrowRight className="w-6 h-6" />
                        </Link>
                        <button className="w-full sm:w-auto px-12 py-5 bg-white/5 border border-white/10 rounded-full text-2xl font-black hover:bg-white/10 transition-all backdrop-blur-md">
                            Live Demo
                        </button>
                    </motion.div>

                    {/* Features Matrix */}
                    <div className="grid md:grid-cols-3 gap-8 text-left">
                        <FeatureBlock 
                            icon={<Zap className="w-8 h-8 text-indigo-400" />}
                            title="Dual-Engine AI"
                            description="Powered by Gemini 2.5 & 2.0 with auto-fallback. Reliability meets world-class copywriting."
                        />
                        <FeatureBlock 
                            icon={<Edit3 className="w-8 h-8 text-fuchsia-400" />}
                            title="Magic Rewrite"
                            description="Highlight any text and let our AI expand, shorten, or change its tone to be more persuasive instantly."
                        />
                        <FeatureBlock 
                            icon={<MessageSquare className="w-8 h-8 text-green-400" />}
                            title="WA Integration"
                            description="One-click lead capture. Convert visitors directly to WhatsApp with automated custom messages."
                        />
                        <FeatureBlock 
                            icon={<Palette className="w-8 h-8 text-yellow-400" />}
                            title="Theme Engine"
                            description="Switch between Modern, Dark Tech, and Minimalist styles instantly. Every theme is conversion-optimized."
                        />
                        <FeatureBlock 
                            icon={<Layout className="w-8 h-8 text-blue-400" />}
                            title="Visual Builder"
                            description="What you see is what you get. Edit copy, manage sections, and preview mobile layouts in one view."
                        />
                        <FeatureBlock 
                            icon={<HelpCircle className="w-8 h-8 text-orange-400" />}
                            title="Smart Sections"
                            description="Instantly generate FAQ and Testimonial blocks with AI to boost social proof and trust."
                        />
                    </div>

                    {/* Tech Stack Badge */}
                    <div className="mt-40 pt-20 border-t border-white/5 flex flex-col items-center">
                        <span className="text-gray-500 font-black uppercase tracking-[0.4em] text-xs mb-10">Powering The Future With</span>
                        <div className="flex flex-wrap items-center justify-center gap-12 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
                            <div className="flex items-center space-x-3 font-bold text-2xl"><img src="https://laravel.com/img/logomark.min.svg" className="w-8" /> <span>Laravel</span></div>
                            <div className="flex items-center space-x-3 font-bold text-2xl"><img src="https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg" className="w-10" /> <span>React</span></div>
                            <div className="flex items-center space-x-3 font-bold text-2xl"><Sparkles className="text-indigo-400" /> <span>Gemini AI</span></div>
                            <div className="flex items-center space-x-3 font-bold text-2xl"><Smartphone className="text-fuchsia-400" /> <span>Responsive</span></div>
                        </div>
                    </div>
                </main>

                <Footer />
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes gradient-x {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                .animate-gradient-x {
                    background-size: 200% auto;
                    animation: gradient-x 5s ease infinite;
                }
            `}} />
        </>
    );
}

function FeatureBlock({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
    return (
        <div className="p-10 bg-white/[0.03] border border-white/5 rounded-[3rem] hover:bg-white/[0.06] hover:border-indigo-500/30 transition-all group backdrop-blur-sm">
            <div className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
                {icon}
            </div>
            <h3 className="text-3xl font-black mb-4 tracking-tighter">{title}</h3>
            <p className="text-gray-400 leading-relaxed font-medium">{description}</p>
        </div>
    );
}
