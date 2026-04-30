import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Lock, Trash2, Settings, Home, Sun, Moon } from 'lucide-react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({
    mustVerifyEmail,
    status,
}: PageProps<{ mustVerifyEmail: boolean; status?: string }>) {
    const [activeTab, setActiveTab] = useState<'general' | 'security' | 'danger'>('general');
    const [theme, setTheme] = useState('dark');
    const [showUserMenu, setShowUserMenu] = useState(false);

    useEffect(() => {
        const handleThemeChange = () => {
            const savedTheme = localStorage.getItem('theme') || 'dark';
            setTheme(savedTheme);
        };
        handleThemeChange();
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

    const tabs = [
        { id: 'general', label: 'General', icon: User },
        { id: 'security', label: 'Security', icon: Lock },
        { id: 'danger', label: 'Danger Zone', icon: Trash2 },
    ];

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center space-x-3">
                    <div className="p-2 bg-indigo-500/10 rounded-xl">
                        <Settings className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <h2 className={`text-xl font-bold leading-tight tracking-tight transition-colors ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                        Account Settings
                    </h2>
                </div>
            }
        >
            <Head title="Profile Settings" />

            <div className={`py-8 lg:py-12 transition-colors duration-500 min-h-[calc(100vh-73px)] ${theme === 'dark' ? 'bg-[#0a0a0c]' : 'bg-slate-50'}`}>
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        {/* Tab Navigation - Responsive */}
                        <div className="lg:col-span-1">
                            <div className="relative flex lg:flex-col overflow-x-auto lg:overflow-x-visible pb-4 lg:pb-0 space-x-2 lg:space-x-0 lg:space-y-2 scrollbar-hide snap-x px-1">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id as any)}
                                        className={`relative flex-none lg:w-full flex items-center space-x-3 px-6 py-4 rounded-2xl transition-all duration-300 snap-start ${
                                            activeTab === tab.id 
                                            ? 'text-white' 
                                            : theme === 'dark' ? 'text-gray-500 hover:bg-white/5 hover:text-gray-300' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600'
                                        }`}
                                    >
                                        {activeTab === tab.id && (
                                            <motion.div
                                                layoutId="activeTabPill"
                                                className="absolute inset-0 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-600/20 lg:translate-x-2 z-0"
                                                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                                            />
                                        )}
                                        <div className="relative z-10 flex items-center space-x-3">
                                            <tab.icon className={`h-5 w-5 ${activeTab === tab.id ? 'text-white' : (theme === 'dark' ? 'text-gray-500' : 'text-slate-400')}`} />
                                            <span className="font-bold text-sm tracking-wide whitespace-nowrap">{tab.label}</span>
                                        </div>
                                    </button>
                                ))}
                                {/* Gradient hint for mobile scroll */}
                                <div className={`lg:hidden absolute right-0 top-0 bottom-4 w-12 bg-gradient-to-l pointer-events-none ${theme === 'dark' ? 'from-[#0a0a0c] to-transparent' : 'from-slate-50 to-transparent'}`} />
                            </div>
                        </div>

                        {/* Tab Content */}
                        <div className="lg:col-span-3">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeTab}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {activeTab === 'general' && (
                                        <div className={`border p-6 shadow-2xl sm:rounded-[2.5rem] sm:p-10 backdrop-blur-xl transition-all duration-500 ${
                                            theme === 'dark' 
                                            ? 'bg-[#121217] border-white/5' 
                                            : 'bg-white border-slate-100'
                                        }`}>
                                            <UpdateProfileInformationForm
                                                mustVerifyEmail={mustVerifyEmail}
                                                status={status}
                                                className="max-w-2xl"
                                            />
                                        </div>
                                    )}

                                    {activeTab === 'security' && (
                                        <div className={`border p-6 shadow-2xl sm:rounded-[2.5rem] sm:p-10 backdrop-blur-xl transition-all duration-500 ${
                                            theme === 'dark' 
                                            ? 'bg-[#121217] border-white/5' 
                                            : 'bg-white border-slate-100'
                                        }`}>
                                            <UpdatePasswordForm className="max-w-2xl" />
                                        </div>
                                    )}

                                    {activeTab === 'danger' && (
                                        <div className={`border p-6 shadow-2xl sm:rounded-[2.5rem] sm:p-10 backdrop-blur-xl transition-all duration-500 ${
                                            theme === 'dark' 
                                            ? 'bg-red-500/5 border-red-500/10' 
                                            : 'bg-red-50 border-red-200 shadow-red-500/5'
                                        }`}>
                                            <DeleteUserForm className="max-w-2xl" />
                                        </div>
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>

            {/* Global Bottom Navigation Bar */}
            <div className="lg:hidden fixed bottom-6 left-0 right-0 z-[100] px-4 no-print">
                <AnimatePresence>
                    {/* User Menu Sheet (Right) */}
                    {showUserMenu && (
                        <>
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowUserMenu(false)} className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
                            <motion.div 
                                initial={{ y: 20, opacity: 0, scale: 0.95 }} 
                                animate={{ y: 0, opacity: 1, scale: 1 }} 
                                exit={{ y: 20, opacity: 0, scale: 0.95 }} 
                                className={`absolute bottom-24 right-4 w-64 rounded-3xl border p-3 shadow-2xl ${
                                    theme === 'dark' ? 'border-white/10 bg-gray-900 text-white' : 'border-indigo-100 bg-white text-slate-900'
                                }`}
                            >
                                <div className="space-y-1">
                                    <div className="flex w-full items-center space-x-3 rounded-xl p-3 bg-indigo-500/10 text-indigo-400">
                                        <User className="h-5 w-5" />
                                        <span className="font-bold text-sm">Active: Profile</span>
                                    </div>
                                    <button 
                                        onClick={() => { 
                                            const newTheme = theme === 'dark' ? 'light' : 'dark';
                                            localStorage.setItem('theme', newTheme);
                                            window.dispatchEvent(new Event('theme-changed'));
                                            setShowUserMenu(false); 
                                        }} 
                                        className="flex w-full items-center space-x-3 rounded-xl p-3 transition-all hover:bg-indigo-500/10"
                                    >
                                        {theme === 'dark' ? <Sun className="h-5 w-5 text-yellow-500" /> : <Moon className="h-5 w-5 text-indigo-500" />}
                                        <span className="font-bold text-sm">Switch to {theme === 'dark' ? 'Light' : 'Dark'}</span>
                                    </button>
                                    <div className="h-px bg-white/5 my-1" />
                                    <Link method="post" href={route('logout')} as="button" className="flex w-full items-center space-x-3 rounded-xl p-3 transition-all hover:bg-red-500/10 text-red-500">
                                        <Trash2 className="h-5 w-5" />
                                        <span className="font-bold text-sm">Log Out</span>
                                    </Link>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>

                <motion.div 
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className={`relative mx-auto flex max-w-md items-center justify-between rounded-[2.5rem] border p-2 shadow-2xl backdrop-blur-2xl ${
                        theme === 'dark' 
                        ? 'border-white/10 bg-black/60 shadow-black/40' 
                        : 'border-indigo-100 bg-white/80 shadow-indigo-600/10'
                    }`}
                >
                    {/* Home */}
                    <Link
                        href={route('dashboard')}
                        className={`flex flex-1 flex-col items-center justify-center rounded-2xl py-2 transition-all active:scale-90 ${
                            theme === 'dark' ? 'text-gray-400 hover:bg-white/5' : 'text-slate-500 hover:bg-slate-50'
                        }`}
                    >
                        <Home className="h-5 w-5" />
                        <span className="mt-1 text-[8px] font-bold uppercase tracking-widest">Home</span>
                    </Link>

                    {/* Center Action: Settings (Active) */}
                    <div className="relative px-2">
                        <div
                            className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-600 text-white shadow-xl shadow-indigo-600/40 transition-all active:scale-90"
                        >
                            <Settings className="h-8 w-8 animate-spin-slow" />
                        </div>
                    </div>

                    {/* User Menu Toggle */}
                    <button
                        onClick={() => setShowUserMenu(!showUserMenu)}
                        className={`flex flex-1 flex-col items-center justify-center rounded-2xl py-2 transition-all active:scale-90 ${
                            theme === 'dark' ? 'text-gray-400 hover:bg-white/5' : 'text-slate-500 hover:bg-slate-50'
                        }`}
                    >
                        <User className="h-5 w-5" />
                        <span className="mt-1 text-[8px] font-bold uppercase tracking-widest">Account</span>
                    </button>
                </motion.div>
            </div>

        </AuthenticatedLayout>
    );
}
