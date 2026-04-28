import { Link, Head } from '@inertiajs/react';
import Footer from '@/Components/Footer';
import { PageProps } from '@/types';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Zap, Shield, BarChart3, Globe } from 'lucide-react';

export default function Welcome({ auth }: PageProps<{ laravelVersion: string, phpVersion: string }>) {
    return (
        <>
            <Head title="MarketAI - High-Conversion Sales Pages in Seconds" />
            
            <div className="bg-[#0a0a0c] text-white min-h-screen overflow-hidden selection:bg-indigo-500/30">
                {/* Background Blobs */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] overflow-hidden pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[80%] bg-indigo-600/20 blur-[120px] rounded-full" />
                    <div className="absolute top-[10%] right-[-10%] w-[40%] h-[80%] bg-purple-600/20 blur-[120px] rounded-full" />
                </div>

                {/* Navbar */}
                <nav className="relative z-50 flex items-center justify-between px-6 py-8 max-w-7xl mx-auto">
                    <div className="flex items-center space-x-2">
                        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                            <span className="text-white font-bold text-2xl">M</span>
                        </div>
                        <span className="text-2xl font-bold tracking-tight">MarketAI</span>
                    </div>
                    <div className="flex items-center space-x-6">
                        {auth.user ? (
                            <Link
                                href={route('dashboard')}
                                className="px-6 py-2.5 bg-white/5 border border-white/10 rounded-full font-medium hover:bg-white/10 transition-all"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link href={route('login')} className="text-gray-400 hover:text-white transition-colors font-medium">
                                    Login
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="px-6 py-2.5 bg-indigo-600 rounded-full font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20"
                                >
                                    Get Started Free
                                </Link>
                            </>
                        )}
                    </div>
                </nav>

                {/* Hero Section */}
                <main className="relative z-10 pt-20 pb-32 px-6 max-w-7xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="inline-flex items-center space-x-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-8"
                    >
                        <Sparkles className="w-4 h-4 text-indigo-400" />
                        <span className="text-sm font-medium text-indigo-200 tracking-wide">AI-Powered Sales Page Generator</span>
                    </motion.div>

                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-6xl md:text-8xl font-black mb-8 leading-[1.1] tracking-tight"
                    >
                        Convert Visitors Into <br />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 animate-gradient-x">
                            Customers Instantly
                        </span>
                    </motion.h1>

                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto mb-12 leading-relaxed"
                    >
                        The ultimate AI tool for marketers and entrepreneurs. Build high-converting sales pages in seconds, not weeks.
                    </motion.p>

                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6"
                    >
                        <Link
                            href={route('register')}
                            className="w-full sm:w-auto px-10 py-4 bg-indigo-600 rounded-full text-xl font-bold hover:bg-indigo-700 transition-all flex items-center justify-center space-x-2 group"
                        >
                            <span>Start Building Now</span>
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <button className="w-full sm:w-auto px-10 py-4 bg-white/5 border border-white/10 rounded-full text-xl font-bold hover:bg-white/10 transition-all">
                            View Examples
                        </button>
                    </motion.div>

                    {/* Dashboard Preview Mockup */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 40 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="mt-24 relative"
                    >
                        <div className="absolute inset-0 bg-indigo-500/20 blur-[100px] rounded-full" />
                        <div className="relative p-2 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-3xl overflow-hidden shadow-2xl">
                            <div className="bg-[#121217] rounded-[2rem] p-4 aspect-[16/9] overflow-hidden border border-white/10">
                                {/* Mock UI Elements */}
                                <div className="w-full h-full bg-[#0a0a0c] rounded-2xl p-8 flex flex-col items-start text-left space-y-6">
                                    <div className="flex space-x-2">
                                        <div className="w-3 h-3 bg-red-500/50 rounded-full" />
                                        <div className="w-3 h-3 bg-yellow-500/50 rounded-full" />
                                        <div className="w-3 h-3 bg-green-500/50 rounded-full" />
                                    </div>
                                    <div className="w-1/3 h-8 bg-white/5 rounded-lg animate-pulse" />
                                    <div className="w-full grid grid-cols-2 gap-4">
                                        <div className="h-32 bg-white/5 rounded-xl animate-pulse" />
                                        <div className="h-32 bg-indigo-500/10 rounded-xl animate-pulse border border-indigo-500/20" />
                                    </div>
                                    <div className="w-full h-40 bg-white/5 rounded-xl animate-pulse" />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </main>

                {/* Features Section */}
                <section className="relative z-10 py-32 px-6 bg-white/5 border-t border-white/5">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-20">
                            <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Built for Performance</h2>
                            <p className="text-xl text-gray-400">Everything you need to scale your conversions with AI.</p>
                        </div>
                        
                        <div className="grid md:grid-cols-3 gap-12">
                            <FeatureCard 
                                icon={<Zap className="w-6 h-6 text-yellow-400" />}
                                title="Instant Generation"
                                description="Get a complete sales page including copy and structure in under 30 seconds."
                            />
                            <FeatureCard 
                                icon={<BarChart3 className="w-6 h-6 text-indigo-400" />}
                                title="Conversion Focused"
                                description="AI trained on world-class copywriting frameworks like AIDA and PAS."
                            />
                            <FeatureCard 
                                icon={<Globe className="w-6 h-6 text-green-400" />}
                                title="One-Click Export"
                                description="Download your page as a standalone HTML file ready to host anywhere."
                            />
                        </div>
                    </div>
                </section>
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

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
    return (
        <div className="p-8 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/10 hover:border-indigo-500/30 transition-all group">
            <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {icon}
            </div>
            <h3 className="text-2xl font-bold mb-4">{title}</h3>
            <p className="text-gray-400 leading-relaxed">{description}</p>
        </div>
    );
}
