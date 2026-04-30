import Footer from '@/Components/Footer';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { PropsWithChildren, useState, useEffect } from 'react';
import { Toaster } from 'sonner';

export default function Guest({ children }: PropsWithChildren) {
    const [theme, setTheme] = useState('dark');

    useEffect(() => {
        const storedTheme = localStorage.getItem('theme') || 'dark';
        setTheme(storedTheme);
        if (storedTheme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, []);

    return (
        <div className={`relative flex min-h-screen flex-col items-center overflow-hidden transition-colors duration-500 pt-6 sm:justify-center sm:pt-0 ${
            theme === 'dark' ? 'bg-[#0a0a0c]' : 'bg-[#F8F9FA]'
        }`}>
            <Toaster position="top-right" theme={theme === 'dark' ? 'dark' : 'light'} richColors />
            
            {/* Background Decor */}
            <div className={`absolute left-[-10%] top-[-10%] h-[80%] w-[40%] rounded-full blur-[120px] transition-colors duration-500 ${
                theme === 'dark' ? 'bg-indigo-600/10' : 'bg-indigo-500/5'
            }`} />
            <div className={`absolute bottom-[-10%] right-[-10%] h-[80%] w-[40%] rounded-full blur-[120px] transition-colors duration-500 ${
                theme === 'dark' ? 'bg-purple-600/10' : 'bg-fuchsia-500/5'
            }`} />

            <div className="z-10 flex w-full flex-grow flex-col items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="z-10"
                >
                    <Link href="/">
                        <div className="mb-8 flex items-center space-x-3 group">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 shadow-lg shadow-indigo-600/20 transition-transform group-hover:scale-110">
                                <span className="text-2xl font-bold text-white">
                                    M
                                </span>
                            </div>
                            <span className={`text-3xl font-black tracking-tight transition-colors ${
                                theme === 'dark' ? 'text-white' : 'text-slate-900'
                            }`}>
                                MarketAI
                            </span>
                        </div>
                    </Link>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`z-10 mt-6 w-full overflow-hidden border px-8 py-8 shadow-2xl backdrop-blur-xl sm:max-w-md sm:rounded-[2.5rem] transition-all duration-500 ${
                        theme === 'dark' 
                        ? 'border-white/10 bg-[#121217]/80' 
                        : 'border-white bg-white/70 shadow-indigo-500/5'
                    }`}
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
