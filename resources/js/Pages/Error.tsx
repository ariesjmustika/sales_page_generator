import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, Ghost, Sparkles } from 'lucide-react';
import { Head } from '@inertiajs/react';

export default function Error({ status }: { status: number }) {
    const title = {
        503: '503: Service Unavailable',
        500: '500: Server Error',
        404: '404: Page Not Found',
        403: '403: Forbidden',
    }[status] || 'Error';

    const description = {
        503: 'Sorry, we are doing some maintenance. Please check back soon.',
        500: 'Whoops, something went wrong on our servers.',
        404: 'The page you are looking for might have been moved or deleted.',
        403: 'Sorry, you are forbidden from accessing this page.',
    }[status] || 'An unexpected error occurred.';

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#0a0a0c] px-6 py-24 sm:py-32 lg:px-8 overflow-hidden relative">
            <Head title={title} />
            
            {/* Background Decor */}
            <div className="absolute left-[-10%] top-[-10%] h-[80%] w-[40%] rounded-full bg-indigo-600/10 blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] h-[80%] w-[40%] rounded-full bg-purple-600/10 blur-[120px]" />

            {/* Floating Particles */}
            <div className="absolute inset-0 pointer-events-none">
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute h-1 w-1 rounded-full bg-white/20"
                        animate={{
                            y: [0, -100, 0],
                            opacity: [0, 1, 0],
                            scale: [1, 1.5, 1],
                        }}
                        transition={{
                            duration: Math.random() * 5 + 3,
                            repeat: Infinity,
                            delay: Math.random() * 5,
                        }}
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                    />
                ))}
            </div>

            <div className="text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="flex justify-center mb-8">
                        <div className="relative">
                            <motion.div
                                animate={{ 
                                    rotate: [0, 5, -5, 0],
                                    y: [0, -10, 0]
                                }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="bg-indigo-500/20 p-6 rounded-3xl backdrop-blur-xl border border-indigo-500/30"
                            >
                                <Ghost className="h-20 w-20 text-indigo-400" />
                            </motion.div>
                            <motion.div
                                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="absolute -top-2 -right-2"
                            >
                                <Sparkles className="h-8 w-8 text-fuchsia-500" />
                            </motion.div>
                        </div>
                    </div>

                    <p className="text-base font-black uppercase tracking-[0.4em] text-indigo-500 mb-4">
                        Status Code: {status}
                    </p>
                    
                    <h1 className="mt-4 text-4xl font-black tracking-tighter text-white sm:text-6xl bg-gradient-to-b from-white to-gray-500 bg-clip-text text-transparent">
                        Lost in Space
                    </h1>
                    
                    <p className="mt-6 text-lg leading-7 text-gray-400 max-w-lg mx-auto">
                        {description}
                    </p>

                    <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6">
                        <Link
                            href={route('dashboard')}
                            className="group relative flex items-center space-x-3 rounded-2xl bg-indigo-600 px-8 py-4 text-lg font-bold text-white shadow-2xl shadow-indigo-600/30 transition-all hover:bg-indigo-500 hover:scale-105 active:scale-95"
                        >
                            <Home className="h-5 w-5" />
                            <span>Back to Safety</span>
                        </Link>
                        
                        <button
                            onClick={() => window.history.back()}
                            className="flex items-center space-x-3 rounded-2xl border border-white/10 bg-white/5 px-8 py-4 text-lg font-bold text-gray-300 backdrop-blur-md transition-all hover:bg-white/10 hover:border-white/20 active:scale-95"
                        >
                            <ArrowLeft className="h-5 w-5" />
                            <span>Previous Page</span>
                        </button>
                    </div>
                </motion.div>

                {/* Fun Message */}
                <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 1 }}
                    className="mt-16 text-sm text-gray-600 font-medium italic"
                >
                    "Even AI gets lost sometimes. Maybe it's checking out a black hole?"
                </motion.p>
            </div>
        </div>
    );
}
