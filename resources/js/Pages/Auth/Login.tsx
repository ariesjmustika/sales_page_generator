import InputError from '@/Components/InputError';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, Sparkles } from 'lucide-react';

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
                <h1 className="text-2xl font-bold text-white mb-2">Welcome Back</h1>
                <p className="text-gray-400 text-sm">Sign in to your MarketAI account</p>
            </div>

            {/* Demo Access Box */}
            <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl mb-8 group cursor-pointer hover:bg-indigo-500/20 transition-all"
                onClick={() => {
                    setData({
                        ...data,
                        email: 'demo@marketai.com',
                        password: 'demo123456'
                    });
                }}
            >
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2 text-indigo-400">
                        <Sparkles className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Recruiter Demo Access</span>
                    </div>
                    <span className="text-[10px] text-indigo-500 font-bold group-hover:underline">Click to Auto-fill</span>
                </div>
                <div className="flex justify-between items-end">
                    <div>
                        <div className="text-sm font-bold text-white">demo@marketai.com</div>
                        <div className="text-[10px] text-gray-500 font-mono tracking-widest">demo123456</div>
                    </div>
                    <LogIn className="w-4 h-4 text-indigo-500/50 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
                </div>
            </motion.div>

            {status && (
                <div className="mb-4 text-sm font-medium text-green-500">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300 flex items-center space-x-2">
                        <Mail className="w-4 h-4" />
                        <span>Email Address</span>
                    </label>
                    <input
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                        placeholder="name@example.com"
                        required
                    />
                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <label className="text-sm font-medium text-gray-300 flex items-center space-x-2">
                            <Lock className="w-4 h-4" />
                            <span>Password</span>
                        </label>
                        {canResetPassword && (
                            <Link
                                href={route('password.request')}
                                className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                            >
                                Forgot?
                            </Link>
                        )}
                    </div>
                    <input
                        type="password"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
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
                        className="w-4 h-4 rounded border-white/10 bg-white/5 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-0"
                    />
                    <span className="ms-2 text-sm text-gray-400">
                        Remember me
                    </span>
                </div>

                <button
                    disabled={processing}
                    className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold flex items-center justify-center space-x-2 transition-all transform active:scale-[0.98] disabled:opacity-50"
                >
                    {processing ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <>
                            <LogIn className="w-5 h-5" />
                            <span>Sign In</span>
                        </>
                    )}
                </button>

                <div className="text-center pt-4">
                    <p className="text-sm text-gray-500">
                        Don't have an account?{' '}
                        <Link href={route('register')} className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
                            Sign Up
                        </Link>
                    </p>
                </div>
            </form>
        </GuestLayout>
    );
}
