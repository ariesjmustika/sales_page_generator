import Checkbox from '@/Components/Checkbox';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, LogIn, Mail, Lock } from 'lucide-react';
import { toast } from 'sonner';

export default function Login({ status, canResetPassword }: { status?: string; canResetPassword?: boolean }) {
    const emailInput = useRef<HTMLInputElement>(null);
    const passwordInput = useRef<HTMLInputElement>(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        if (!data.email) {
            toast.error('Email address is required!');
            emailInput.current?.focus();
            return;
        }
        if (!data.password) {
            toast.error('Please enter your password.');
            passwordInput.current?.focus();
            return;
        }

        post(route('login'), {
            onFinish: () => reset('password'),
            onError: (err) => {
                if (err.email) {
                    emailInput.current?.focus();
                    toast.error(err.email);
                } else if (err.password) {
                    passwordInput.current?.focus();
                    toast.error(err.password);
                } else {
                    toast.error('Failed to sign in. Please check your credentials.');
                }
            },
        });
    };

    return (
        <GuestLayout>
            <Head title="Sign In - MarketAI" />

            <AnimatePresence>
                {processing && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0a0a0c]/80 backdrop-blur-md"
                    >
                        <div className="text-center">
                            <div className="relative mx-auto mb-6 h-20 w-20">
                                <div className="absolute inset-0 animate-spin rounded-full border-4 border-indigo-500/20 border-t-indigo-500"></div>
                                <div className="absolute inset-4 animate-pulse rounded-full bg-indigo-500/20 flex items-center justify-center">
                                    <Sparkles className="h-6 w-6 text-indigo-400" />
                                </div>
                            </div>
                            <h2 className="text-xl font-bold text-white tracking-tight animate-pulse">
                                Signing you in...
                            </h2>
                            <p className="mt-2 font-black uppercase tracking-[0.2em] text-[10px] text-gray-500">
                                Authenticating Access
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="mb-8 text-center">
                <h1 className="text-3xl font-black tracking-tight text-white">Welcome Back</h1>
                <p className="mt-2 text-gray-400">Enter your credentials to access your dashboard</p>
            </div>

            {status && (
                <div className="mb-6 rounded-xl bg-green-500/10 border border-green-500/20 p-4 text-sm font-medium text-green-400 text-center">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-6">
                <div>
                    <InputLabel htmlFor="email" className="text-gray-300 mb-2 flex items-center space-x-2">
                        <Mail className="h-4 w-4" />
                        <span>Email Address</span>
                    </InputLabel>

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        ref={emailInput}
                        value={data.email}
                        className={`mt-1 block w-full bg-white/5 border-white/10 text-white focus:border-indigo-500 focus:ring-indigo-500 rounded-xl py-4 transition-all ${errors.email ? 'border-red-500/50 bg-red-500/5' : ''}`}
                        autoComplete="username"
                        isFocused={true}
                        onChange={(e) => setData('email', e.target.value)}
                        placeholder="your@email.com"
                    />

                    <AnimatePresence>
                        {errors.email && (
                            <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}>
                                <InputError message={errors.email} className="mt-2" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div>
                    <div className="flex items-center justify-between mb-2">
                        <InputLabel htmlFor="password" className="text-gray-300 flex items-center space-x-2">
                            <Lock className="h-4 w-4" />
                            <span>Password</span>
                        </InputLabel>
                        {canResetPassword && (
                            <Link
                                href={route('password.request')}
                                className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
                            >
                                Forgot Password?
                            </Link>
                        )}
                    </div>

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        ref={passwordInput}
                        value={data.password}
                        className={`mt-1 block w-full bg-white/5 border-white/10 text-white focus:border-indigo-500 focus:ring-indigo-500 rounded-xl py-4 transition-all ${errors.password ? 'border-red-500/50 bg-red-500/5' : ''}`}
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                        placeholder="••••••••"
                    />

                    <AnimatePresence>
                        {errors.password && (
                            <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}>
                                <InputError message={errors.password} className="mt-2" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="flex items-center">
                    <Checkbox
                        name="remember"
                        checked={data.remember}
                        onChange={(e) => setData('remember', e.target.checked)}
                    />
                    <span className="ms-2 text-sm text-gray-400">Remember me</span>
                </div>

                <div className="pt-2">
                    <PrimaryButton 
                        className="w-full justify-center py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20 text-lg group" 
                        disabled={processing}
                    >
                        <span>Sign In</span>
                        <LogIn className="ms-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </PrimaryButton>
                </div>

                <p className="text-center text-sm text-gray-500">
                    Don't have an account?{' '}
                    <Link
                        href={route('register')}
                        className="font-bold text-white hover:text-indigo-400 transition-colors"
                    >
                        Sign up for free
                    </Link>
                </p>
            </form>
        </GuestLayout>
    );
}
