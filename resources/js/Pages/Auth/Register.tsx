import InputError from '@/Components/InputError';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Lock, Mail, User, UserPlus } from 'lucide-react';
import { FormEventHandler } from 'react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Register" />

            <div className="mb-8 text-center">
                <h1 className="mb-2 text-2xl font-bold text-white">
                    Create Account
                </h1>
                <p className="text-sm text-gray-400">
                    Join MarketAI and start selling better
                </p>
            </div>

            <form onSubmit={submit} className="space-y-4">
                <div className="space-y-2">
                    <label className="flex items-center space-x-2 text-sm font-medium text-gray-300">
                        <User className="h-4 w-4" />
                        <span>Full Name</span>
                    </label>
                    <input
                        type="text"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition-all focus:ring-2 focus:ring-indigo-500"
                        placeholder="John Doe"
                        required
                    />
                    <InputError message={errors.name} className="mt-2" />
                </div>

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
                    <label className="flex items-center space-x-2 text-sm font-medium text-gray-300">
                        <Lock className="h-4 w-4" />
                        <span>Password</span>
                    </label>
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

                <div className="space-y-2">
                    <label className="flex items-center space-x-2 text-sm font-medium text-gray-300">
                        <Lock className="h-4 w-4" />
                        <span>Confirm Password</span>
                    </label>
                    <input
                        type="password"
                        value={data.password_confirmation}
                        onChange={(e) =>
                            setData('password_confirmation', e.target.value)
                        }
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition-all focus:ring-2 focus:ring-indigo-500"
                        placeholder="••••••••"
                        required
                    />
                    <InputError
                        message={errors.password_confirmation}
                        className="mt-2"
                    />
                </div>

                <div className="pt-4">
                    <button
                        disabled={processing}
                        className="flex w-full transform items-center justify-center space-x-2 rounded-xl bg-indigo-600 py-4 font-bold text-white transition-all hover:bg-indigo-700 active:scale-[0.98] disabled:opacity-50"
                    >
                        {processing ? (
                            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        ) : (
                            <>
                                <UserPlus className="h-5 w-5" />
                                <span>Create Account</span>
                            </>
                        )}
                    </button>
                </div>

                <div className="pt-4 text-center">
                    <p className="text-sm text-gray-500">
                        Already have an account?{' '}
                        <Link
                            href={route('login')}
                            className="font-semibold text-indigo-400 transition-colors hover:text-indigo-300"
                        >
                            Sign In
                        </Link>
                    </p>
                </div>
            </form>
        </GuestLayout>
    );
}
