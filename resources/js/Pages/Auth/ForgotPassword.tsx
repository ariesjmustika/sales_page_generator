import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { FormEventHandler, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ArrowLeft, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

export default function ForgotPassword({ status }: { status?: string }) {
    const [theme, setTheme] = useState('dark');

    useEffect(() => {
        setTheme(localStorage.getItem('theme') || 'dark');
    }, []);

    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        
        if (!data.email) {
            toast.error('Please enter your email address.');
            return;
        }

        post(route('password.email'), {
            onSuccess: () => {
                toast.success('Reset link sent! Please check your inbox.');
            },
        });
    };

    return (
        <GuestLayout>
            <Head title="Forgot Password - MarketAI" />

            <AnimatePresence>
                {processing && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className={`fixed inset-0 z-[100] flex items-center justify-center backdrop-blur-md ${theme === 'dark' ? 'bg-[#0a0a0c]/80' : 'bg-white/80'}`}
                    >
                        <div className="text-center">
                            <div className="relative mx-auto mb-6 h-20 w-20">
                                <div className="absolute inset-0 animate-spin rounded-full border-4 border-indigo-500/20 border-t-indigo-500"></div>
                                <div className="absolute inset-4 animate-pulse rounded-full bg-indigo-500/20 flex items-center justify-center">
                                    <Sparkles className="h-6 w-6 text-indigo-400" />
                                </div>
                            </div>
                            <h2 className={`text-xl font-bold tracking-tight animate-pulse ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                                Sending reset link...
                            </h2>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="mb-8 text-center">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-500/10">
                    <Mail className="h-8 w-8 text-indigo-500" />
                </div>
                <h1 className={`text-3xl font-black tracking-tight transition-colors ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Reset Password</h1>
                <p className="mt-3 text-sm text-gray-500 leading-relaxed px-4">
                    Forgot your password? No problem. Just let us know your email address and we will email you a password reset link.
                </p>
            </div>

            {status && (
                <div className="mb-6 rounded-xl bg-green-500/10 border border-green-500/20 p-4 text-sm font-medium text-green-500 text-center">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-6">
                <div>
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className={`mt-1 block w-full rounded-xl py-4 transition-all ${
                            theme === 'dark'
                            ? 'bg-white/5 border-white/10 text-white'
                            : 'bg-slate-50 border-slate-200 text-slate-900'
                        } focus:border-indigo-500 focus:ring-indigo-500 ${errors.email ? 'border-red-500/50 bg-red-500/5' : ''}`}
                        isFocused={true}
                        onChange={(e) => setData('email', e.target.value)}
                        placeholder="Enter your email address"
                    />

                    <AnimatePresence>
                        {errors.email && (
                            <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}>
                                <InputError message={errors.email} className="mt-2" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="pt-2">
                    <PrimaryButton 
                        className="w-full justify-center py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20 text-lg group" 
                        disabled={processing}
                    >
                        <span>Send Reset Link</span>
                    </PrimaryButton>
                </div>

                <div className="text-center pt-2">
                    <Link
                        href={route('login')}
                        className={`inline-flex items-center space-x-2 text-sm font-bold transition-colors ${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`}
                    >
                        <ArrowLeft className="h-4 w-4" />
                        <span>Back to Login</span>
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}
