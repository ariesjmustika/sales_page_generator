import { Link } from '@inertiajs/react';
import { PropsWithChildren } from 'react';
import { motion } from 'framer-motion';
import Footer from '@/Components/Footer';

export default function Guest({ children }: PropsWithChildren) {
    return (
        <div className="flex min-h-screen flex-col items-center bg-[#0a0a0c] pt-6 sm:justify-center sm:pt-0 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[80%] bg-indigo-600/10 blur-[120px] rounded-full" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[80%] bg-purple-600/10 blur-[120px] rounded-full" />

            <div className="flex-grow flex flex-col items-center justify-center w-full z-10">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="z-10"
                >
                    <Link href="/">
                        <div className="flex items-center space-x-3 mb-8">
                            <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                                <span className="text-white font-bold text-2xl">M</span>
                            </div>
                            <span className="text-3xl font-bold text-white tracking-tight">MarketAI</span>
                        </div>
                    </Link>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="z-10 mt-6 w-full overflow-hidden bg-[#121217]/80 backdrop-blur-xl border border-white/10 px-8 py-8 shadow-2xl sm:max-w-md sm:rounded-3xl"
                >
                    {children}
                </motion.div>
            </div>

            <div className="z-10 w-full">
                <Footer />
            </div>
        </div>
    );
}
