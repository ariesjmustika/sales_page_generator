import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler, useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, UserPlus, User, Mail, Lock } from 'lucide-react';
import { toast } from 'sonner';

export default function Register() {
    const nameInput = useRef<HTMLInputElement>(null);
    const emailInput = useRef<HTMLInputElement>(null);
    const passwordInput = useRef<HTMLInputElement>(null);
    const confirmInput = useRef<HTMLInputElement>(null);

    const [loadingStage, setLoadingStage] = useState(1);
    const [isOverlayVisible, setIsOverlayVisible] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    useEffect(() => {
        let interval: any;
        if (processing) {
            setIsOverlayVisible(true);
            setLoadingStage(1);
            interval = setInterval(() => {
                setLoadingStage((prev) => (prev < 2 ? prev + 1 : prev));
            }, 600);
        } else if (isOverlayVisible) {
            // Hold the overlay for a split second after processing finishes for better UX
            const timer = setTimeout(() => {
                setIsOverlayVisible(false);
            }, 800);
            return () => clearTimeout(timer);
        }
        return () => clearInterval(interval);
    }, [processing]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        if (!data.name) {
            toast.error('Full name is required!');
            nameInput.current?.focus();
            return;
        }
        if (!data.email) {
            toast.error('Email address is required!');
            emailInput.current?.focus();
            return;
        }
        if (!data.password) {
            toast.error('Password cannot be empty!');
            passwordInput.current?.focus();
            return;
        }
        if (data.password.length < 8) {
            toast.error('Password must be at least 8 characters!');
            passwordInput.current?.focus();
            return;
        }
        if (data.password !== data.password_confirmation) {
            toast.error('Passwords do not match!');
            confirmInput.current?.focus();
            return;
        }

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
            onError: (err) => {
                if (err.name) {
                    nameInput.current?.focus();
                    toast.error(err.name);
                } else if (err.email) {
                    emailInput.current?.focus();
                    toast.error(err.email);
                } else if (err.password) {
                    passwordInput.current?.focus();
                    toast.error(err.password);
                } else {
                    toast.error('Failed to create account. Please check your details.');
                }
            },
        });
    };

    return (
        <GuestLayout>
            <Head title="Create Account - MarketAI" />

            <AnimatePresence>
                {isOverlayVisible && (
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
                                {loadingStage === 1 ? 'Creating your account...' : 'Authenticating access...'}
                            </h2>
                            <p className="mt-2 font-black uppercase tracking-[0.2em] text-[10px] text-gray-500">
                                {loadingStage === 1 ? 'Setting up Dashboard' : 'Securing Session'}
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="mb-8 text-center">
                <h1 className="text-3xl font-black tracking-tight text-white">Get Started</h1>
                <p className="mt-2 text-gray-400">Join MarketAI and build your first sales funnel today</p>
            </div>

            <form onSubmit={submit} className="space-y-5">
                <div>
                    <InputLabel htmlFor="name" className="text-gray-300 mb-2 flex items-center space-x-2">
                        <User className="h-4 w-4" />
                        <span>Full Name</span>
                    </InputLabel>

                    <TextInput
                        id="name"
                        name="name"
                        ref={nameInput}
                        value={data.name}
                        className={`mt-1 block w-full bg-white/5 border-white/10 text-white focus:border-indigo-500 focus:ring-indigo-500 rounded-xl py-4 transition-all ${errors.name ? 'border-red-500/50 bg-red-500/5' : ''}`}
                        autoComplete="name"
                        isFocused={true}
                        onChange={(e) => setData('name', e.target.value)}
                        placeholder="John Doe"
                    />

                    <AnimatePresence>
                        {errors.name && (
                            <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}>
                                <InputError message={errors.name} className="mt-2" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

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
                    <InputLabel htmlFor="password" className="text-gray-300 mb-2 flex items-center space-x-2">
                        <Lock className="h-4 w-4" />
                        <span>Password</span>
                    </InputLabel>

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        ref={passwordInput}
                        value={data.password}
                        className={`mt-1 block w-full bg-white/5 border-white/10 text-white focus:border-indigo-500 focus:ring-indigo-500 rounded-xl py-4 transition-all ${errors.password ? 'border-red-500/50 bg-red-500/5' : ''}`}
                        autoComplete="new-password"
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

                <div>
                    <InputLabel
                        htmlFor="password_confirmation"
                        className="text-gray-300 mb-2 flex items-center space-x-2"
                    >
                        <Lock className="h-4 w-4" />
                        <span>Confirm Password</span>
                    </InputLabel>

                    <TextInput
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        ref={confirmInput}
                        value={data.password_confirmation}
                        className={`mt-1 block w-full bg-white/5 border-white/10 text-white focus:border-indigo-500 focus:ring-indigo-500 rounded-xl py-4 transition-all ${errors.password_confirmation ? 'border-red-500/50 bg-red-500/5' : ''}`}
                        autoComplete="new-password"
                        onChange={(e) =>
                            setData('password_confirmation', e.target.value)
                        }
                        placeholder="••••••••"
                    />

                    <AnimatePresence>
                        {errors.password_confirmation && (
                            <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}>
                                <InputError message={errors.password_confirmation} className="mt-2" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="pt-4">
                    <PrimaryButton 
                        className="w-full justify-center py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20 text-lg group" 
                        disabled={processing}
                    >
                        <span>Create Account</span>
                        <UserPlus className="ms-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </PrimaryButton>
                </div>

                <p className="text-center text-sm text-gray-500">
                    Already have an account?{' '}
                    <Link
                        href={route('login')}
                        className="font-bold text-white hover:text-indigo-400 transition-colors"
                    >
                        Sign in instead
                    </Link>
                </p>
            </form>
        </GuestLayout>
    );
}
