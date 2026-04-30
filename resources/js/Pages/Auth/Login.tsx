import InputError from '@/Components/InputError';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Lock, LogIn, Mail, Sparkles } from 'lucide-react';
import { FormEventHandler } from 'react';

export default function Login({
    status,
    canResetPassword,
}: {
    status?: string;
    canResetPassword: boolean;
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false as boolean,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

            <div className="mb-8 text-center">
                <h1 className="mb-2 text-2xl font-bold text-white">
                    Welcome Back
                </h1>
                <p className="text-sm text-gray-400">
                    Sign in to your MarketAI account
                </p>
            </div>

            {/* Demo Access Box */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="group mb-8 cursor-pointer rounded-2xl border border-indigo-500/20 bg-indigo-500/10 p-4 transition-all hover:bg-indigo-500/20"
                onClick={() => {
                    setData({
                        ...data,
                        email: 'demo@marketai.com',
                        password: 'demo123456',
                    });
                }}
            >
                <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-indigo-400">
                        <Sparkles className="h-4 w-4" />
                        <span className="text-[10px] font-black uppercase tracking-widest">
                            Recruiter Demo Access
                        </span>
                    </div>
                    <span className="text-[10px] font-bold text-indigo-500 group-hover:underline">
                        Click to Auto-fill
                    </span>
                </div>
                <div className="flex items-end justify-between">
                    <div>
                        <div className="text-sm font-bold text-white">
                            demo@marketai.com
                        </div>
                        <div className="font-mono text-[10px] tracking-widest text-gray-500">
                            demo123456
                        </div>
                    </div>
                    <LogIn className="h-4 w-4 text-indigo-500/50 transition-all group-hover:translate-x-1 group-hover:text-indigo-400" />
                </div>
            </motion.div>

            {status && (
                <div className="mb-4 text-sm font-medium text-green-500">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-6">
                <div className="space-y-2">
                    <label className="flex items-center space-x-2 text-sm font-medium text-gray-300">
                        <Mail className="h-4 w-4" />
                        <span>Email Address</span>
                    </label>
                    <input
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition-all focus:ring-2 focus:ring-indigo-500"
                        placeholder="name@example.com"
                        required
                    />
                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <label className="flex items-center space-x-2 text-sm font-medium text-gray-300">
                            <Lock className="h-4 w-4" />
                            <span>Password</span>
                        </label>
                        {canResetPassword && (
                            <Link
                                href={route('password.request')}
                                className="text-xs text-indigo-400 transition-colors hover:text-indigo-300"
                            >
                                Forgot?
                            </Link>
                        )}
                    </div>
                    <input
                        type="password"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition-all focus:ring-2 focus:ring-indigo-500"
                        placeholder="••••••••"
                        required
                    />
                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="flex items-center">
                    <input
                        type="checkbox"
                        checked={data.remember}
                        onChange={(e) => setData('remember', e.target.checked)}
                        className="h-4 w-4 rounded border-white/10 bg-white/5 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-0"
                    />
                    <span className="ms-2 text-sm text-gray-400">
                        Remember me
                    </span>
                </div>

                <button
                    disabled={processing}
                    className="flex w-full transform items-center justify-center space-x-2 rounded-xl bg-indigo-600 py-4 font-bold text-white transition-all hover:bg-indigo-700 active:scale-[0.98] disabled:opacity-50"
                >
                    {processing ? (
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    ) : (
                        <>
                            <LogIn className="h-5 w-5" />
                            <span>Sign In</span>
                        </>
                    )}
                </button>

                <div className="pt-4 text-center">
                    <p className="text-sm text-gray-500">
                        Don't have an account?{' '}
                        <Link
                            href={route('register')}
                            className="font-semibold text-indigo-400 transition-colors hover:text-indigo-300"
                        >
                            Sign Up
                        </Link>
                    </p>
                </div>
            </form>
        </GuestLayout>
    );
}
