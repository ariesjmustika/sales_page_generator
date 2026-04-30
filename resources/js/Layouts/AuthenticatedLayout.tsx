import Dropdown from '@/Components/Dropdown';
import Footer from '@/Components/Footer';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage, router, useForm } from '@inertiajs/react';
import { LayoutDashboard, LogOut, User, Sparkles, AlertTriangle, Sun, Moon } from 'lucide-react';
import { PropsWithChildren, ReactNode, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from 'sonner';

export default function Authenticated({
    header,
    children,
    hideNav = true,
}: PropsWithChildren<{ header?: ReactNode; hideNav?: boolean }>) {
    const user = usePage().props.auth.user;

    const [theme, setTheme] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('theme') || 'dark';
        }
        return 'dark';
    });

    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);
    
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [confirmingLogout, setConfirmingLogout] = useState(false);
    const [isNavigating, setIsNavigating] = useState(false);
    const { post } = useForm();

    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        window.dispatchEvent(new Event('theme-changed'));
    };

    useEffect(() => {
        const handleThemeChange = () => {
            setTheme(localStorage.getItem('theme') || 'dark');
        };
        window.addEventListener('theme-changed', handleThemeChange);
        return () => window.removeEventListener('theme-changed', handleThemeChange);
    }, []);



    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

    const handleLogout = () => {
        setConfirmingLogout(true);
    };

    const confirmLogout = () => {
        setConfirmingLogout(false);
        setIsLoggingOut(true);
        post(route('logout'), {
            onFinish: () => setIsLoggingOut(false),
        });
    };

    useEffect(() => {
        const unbindStart = router.on('start', () => setIsNavigating(true));
        const unbindFinish = router.on('finish', () => setIsNavigating(false));

        return () => {
            unbindStart();
            unbindFinish();
        };
    }, []);

    return (
        <div className={`min-h-screen transition-colors duration-500 ${theme === 'dark' ? 'bg-[#0a0a0c]' : 'bg-[#F8F9FA]'}`}>
            <Toaster position="top-right" theme={theme === 'dark' ? 'dark' : 'light'} richColors />
            
            <AnimatePresence>
                {(isLoggingOut || isNavigating) && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className={`fixed inset-0 z-[200] flex items-center justify-center backdrop-blur-md transition-colors duration-500 ${
                            theme === 'dark' ? 'bg-[#0a0a0c]/80' : 'bg-white/80'
                        }`}
                    >
                        <div className="text-center">
                            <div className="relative mx-auto mb-6 h-20 w-20">
                                <div className="absolute inset-0 animate-spin rounded-full border-4 border-indigo-500/20 border-t-indigo-500"></div>
                                <div className="absolute inset-4 animate-pulse rounded-full bg-indigo-500/20 flex items-center justify-center">
                                    <Sparkles className="h-6 w-6 text-indigo-400" />
                                </div>
                            </div>
                            <h2 className={`text-xl font-bold tracking-tight animate-pulse transition-colors ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                                {isLoggingOut ? 'Logging Out...' : 'Loading MarketAI...'}
                            </h2>
                            <p className="text-sm text-gray-500 mt-2 uppercase tracking-[0.2em] font-black">
                                {isLoggingOut ? 'Securely Ending Session' : 'Magic in Progress'}
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {confirmingLogout && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.95 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.95 }}
                            className={`rounded-2xl p-6 w-full max-w-sm shadow-2xl border transition-all duration-500 ${
                                theme === 'dark' 
                                ? 'bg-[#121217] border-white/10' 
                                : 'bg-white border-slate-100 shadow-slate-200/50'
                            }`}
                        >
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="p-2 bg-red-500/10 rounded-full">
                                    <AlertTriangle className="h-6 w-6 text-red-500" />
                                </div>
                                <h3 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Log Out?</h3>
                            </div>
                            <p className="text-gray-500 text-sm mb-6">Are you sure you want to end your current session?</p>
                            <div className="flex space-x-3">
                                <button
                                    onClick={() => setConfirmingLogout(false)}
                                    className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition ${
                                        theme === 'dark' 
                                        ? 'bg-white/5 hover:bg-white/10 text-white' 
                                        : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                                    }`}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmLogout}
                                    className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-bold transition"
                                >
                                    Confirm Logout
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <nav className={`sticky top-0 z-50 border-b transition-all duration-500 ${theme === 'dark' ? 'border-white/5 bg-[#121217]/50' : 'border-slate-200 bg-white/70'} backdrop-blur-xl`}>
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        <div className="flex">
                            <div className="flex shrink-0 items-center">
                                <Link href="/">
                                    <div className="flex items-center space-x-2">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 shadow-lg shadow-indigo-600/20">
                                            <span className="text-xl font-bold text-white">
                                                M
                                            </span>
                                        </div>
                                        <span className={`hidden text-lg font-black tracking-tight sm:block ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                                            MarketAI
                                        </span>
                                    </div>
                                </Link>
                            </div>

                            <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                                <NavLink
                                    href={route('dashboard')}
                                    active={route().current('dashboard')}
                                    className={theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'}
                                >
                                    <div className="flex items-center space-x-2">
                                        <LayoutDashboard className="h-4 w-4" />
                                        <span>Dashboard</span>
                                    </div>
                                </NavLink>
                            </div>
                        </div>

                        <div className="hidden sm:ms-6 sm:flex sm:items-center sm:space-x-4">
                            {/* Theme Toggle Button */}
                            <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={toggleTheme}
                                className={`flex h-10 w-10 items-center justify-center rounded-xl border transition-all duration-300 ${
                                    theme === 'dark' 
                                    ? 'border-white/10 bg-white/5 text-yellow-400 hover:bg-white/10' 
                                    : 'border-slate-200 bg-slate-50 text-indigo-600 hover:bg-slate-100'
                                } shadow-sm`}
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

                            <div className="relative">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className={`inline-flex items-center rounded-xl border px-4 py-2 text-sm font-bold transition duration-150 ease-in-out focus:outline-none ${
                                                    theme === 'dark'
                                                    ? 'border-white/10 bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white'
                                                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 shadow-sm'
                                                }`}
                                            >
                                                {user.name}

                                                <svg
                                                    className="-me-0.5 ms-2 h-4 w-4 opacity-50"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <Dropdown.Link
                                            href={route('profile.edit')}
                                            className="flex items-center space-x-2 py-3"
                                        >
                                            <User className="h-4 w-4" />
                                            <span className="font-medium">Profile Settings</span>
                                        </Dropdown.Link>
                                        <div className={`border-t my-1 ${theme === 'dark' ? 'border-white/5' : 'border-slate-100'}`} />
                                        <button
                                            onClick={handleLogout}
                                            className="flex w-full items-center space-x-2 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                                        >
                                            <LogOut className="h-4 w-4" />
                                            <span className="font-bold">Log Out</span>
                                        </button>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        {!hideNav && (
                            <div className="-me-2 flex items-center sm:hidden">
                                <button
                                    onClick={() =>
                                        setShowingNavigationDropdown(
                                            (previousState) => !previousState,
                                        )
                                    }
                                    className={`inline-flex items-center justify-center rounded-xl p-2 transition-all ${
                                        theme === 'dark' ? 'text-gray-400 hover:bg-white/5 hover:text-white' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600'
                                    }`}
                                >
                                <svg
                                    className="h-6 w-6"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        className={
                                            !showingNavigationDropdown
                                                ? 'inline-flex'
                                                : 'hidden'
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={
                                            showingNavigationDropdown
                                                ? 'inline-flex'
                                                : 'hidden'
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                        )}
                    </div>
                </div>

                <div
                    className={
                        (showingNavigationDropdown && !hideNav ? 'block' : 'hidden') +
                        ` border-t transition-colors duration-500 sm:hidden ${
                            theme === 'dark' 
                            ? 'border-white/5 bg-[#121217]' 
                            : 'border-slate-200 bg-white'
                        }`
                    }
                >
                    <div className="space-y-1 pb-3 pt-2">
                        <ResponsiveNavLink
                            href={route('dashboard')}
                            active={route().current('dashboard')}
                            className={theme === 'dark' ? 'text-gray-300' : 'text-slate-600'}
                        >
                            Dashboard
                        </ResponsiveNavLink>
                    </div>

                    <div className={`border-t pb-1 pt-4 ${theme === 'dark' ? 'border-white/5' : 'border-slate-100'}`}>
                        <div className="px-4">
                            <div className={`text-base font-bold ${theme === 'dark' ? 'text-gray-200' : 'text-slate-900'}`}>
                                {user.name}
                            </div>
                            <div className="text-sm font-medium text-gray-500">
                                {user.email}
                            </div>
                        </div>

                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink
                                href={route('profile.edit')}
                                className={theme === 'dark' ? 'text-gray-400' : 'text-slate-600'}
                            >
                                Profile
                            </ResponsiveNavLink>
                            <button
                                onClick={handleLogout}
                                className="flex w-full items-center px-4 py-3 text-sm font-bold text-red-400 hover:bg-red-500/10 transition-colors"
                            >
                                Log Out
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {header && (
                <header className={`border-b transition-colors duration-500 ${
                    theme === 'dark' 
                    ? 'border-white/5 bg-[#121217]/30' 
                    : 'border-slate-200 bg-white/50 shadow-sm'
                }`}>
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        <div className={`${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                            {header}
                        </div>
                    </div>
                </header>
            )}

            <main>
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                >
                    {children}
                </motion.div>
            </main>

            <Footer />
        </div>
    );
}
