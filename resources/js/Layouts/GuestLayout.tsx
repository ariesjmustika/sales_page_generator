import Footer from '@/Components/Footer';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { PropsWithChildren } from 'react';

export default function Guest({ children }: PropsWithChildren) {
    return (
        <div className="relative flex min-h-screen flex-col items-center overflow-hidden bg-[#0a0a0c] pt-6 sm:justify-center sm:pt-0">
            {/* Background Decor */}
            <div className="absolute left-[-10%] top-[-10%] h-[80%] w-[40%] rounded-full bg-indigo-600/10 blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] h-[80%] w-[40%] rounded-full bg-purple-600/10 blur-[120px]" />

            <div className="z-10 flex w-full flex-grow flex-col items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="z-10"
                >
                    <Link href="/">
                        <div className="mb-8 flex items-center space-x-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 shadow-lg shadow-indigo-500/20">
                                <span className="text-2xl font-bold text-white">
                                    M
                                </span>
                            </div>
                            <span className="text-3xl font-bold tracking-tight text-white">
                                MarketAI
                            </span>
                        </div>
                    </Link>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="z-10 mt-6 w-full overflow-hidden border border-white/10 bg-[#121217]/80 px-8 py-8 shadow-2xl backdrop-blur-xl sm:max-w-md sm:rounded-3xl"
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
