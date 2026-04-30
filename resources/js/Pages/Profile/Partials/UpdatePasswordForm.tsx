import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import { Transition } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import { FormEventHandler, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

export default function UpdatePasswordForm({
    className = '',
}: {
    className?: string;
}) {
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);
    const confirmInput = useRef<HTMLInputElement>(null);
    const [confirmingPasswordUpdate, setConfirmingPasswordUpdate] = useState(false);

    const {
        data,
        setData,
        errors,
        put,
        reset,
        processing,
        recentlySuccessful,
    } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const requestUpdate: FormEventHandler = (e) => {
        e.preventDefault();

        if (!data.current_password) {
            toast.error('Current password is required!');
            currentPasswordInput.current?.focus();
            return;
        }
        if (!data.password) {
            toast.error('New password cannot be empty!');
            passwordInput.current?.focus();
            return;
        }
        if (data.password.length < 8) {
            toast.error('Password must be at least 8 characters!');
            passwordInput.current?.focus();
            return;
        }
        if (data.password !== data.password_confirmation) {
            toast.error('Password confirmation does not match!');
            confirmInput.current?.focus();
            return;
        }

        setConfirmingPasswordUpdate(true);
    };

    const submit = () => {
        setConfirmingPasswordUpdate(false);
        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                toast.success('Password updated successfully!');
            },
            onError: (errors) => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current?.focus();
                }

                if (errors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current?.focus();
                }
                toast.error('Failed to update password. Please check your details.');
            },
        });
    };

    return (
        <section className={className}>
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
                                    <Lock className="h-6 w-6 text-indigo-400" />
                                </div>
                            </div>
                            <h2 className="text-xl font-bold text-white tracking-tight animate-pulse">
                                Updating Password...
                            </h2>
                            <p className="mt-2 font-black uppercase tracking-[0.2em] text-[10px] text-gray-500">
                                Securing Account
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <header>
                <h2 className="text-xl font-bold text-white tracking-tight">
                    Update Password
                </h2>

                <p className="mt-1 text-sm text-gray-400">
                    Ensure your account is using a long, random password to stay
                    secure.
                </p>
            </header>

            <form onSubmit={requestUpdate} className="mt-8 space-y-6">
                <div>
                    <InputLabel
                        htmlFor="current_password"
                        value="Current Password"
                        className="text-gray-300 mb-2"
                    />

                    <TextInput
                        id="current_password"
                        ref={currentPasswordInput}
                        value={data.current_password}
                        onChange={(e) =>
                            setData('current_password', e.target.value)
                        }
                        type="password"
                        className={`mt-1 block w-full bg-white/5 border-white/10 text-white focus:border-indigo-500 focus:ring-indigo-500 rounded-xl py-4 transition-all ${errors.current_password ? 'border-red-500/50 bg-red-500/5' : ''}`}
                        autoComplete="current-password"
                    />

                    <AnimatePresence>
                        {errors.current_password && (
                            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                                <InputError
                                    message={errors.current_password}
                                    className="mt-2"
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div>
                    <InputLabel htmlFor="password" value="New Password" className="text-gray-300 mb-2" />

                    <TextInput
                        id="password"
                        ref={passwordInput}
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        type="password"
                        className={`mt-1 block w-full bg-white/5 border-white/10 text-white focus:border-indigo-500 focus:ring-indigo-500 rounded-xl py-4 transition-all ${errors.password ? 'border-red-500/50 bg-red-500/5' : ''}`}
                        autoComplete="new-password"
                    />

                    <AnimatePresence>
                        {errors.password && (
                            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                                <InputError message={errors.password} className="mt-2" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div>
                    <InputLabel
                        htmlFor="password_confirmation"
                        value="Confirm Password"
                        className="text-gray-300 mb-2"
                    />

                    <TextInput
                        id="password_confirmation"
                        ref={confirmInput}
                        value={data.password_confirmation}
                        onChange={(e) =>
                            setData('password_confirmation', e.target.value)
                        }
                        type="password"
                        className={`mt-1 block w-full bg-white/5 border-white/10 text-white focus:border-indigo-500 focus:ring-indigo-500 rounded-xl py-4 transition-all ${errors.password_confirmation ? 'border-red-500/50 bg-red-500/5' : ''}`}
                        autoComplete="new-password"
                    />

                    <AnimatePresence>
                        {errors.password_confirmation && (
                            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                                <InputError
                                    message={errors.password_confirmation}
                                    className="mt-2"
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="flex items-center gap-4 pt-4">
                    <PrimaryButton 
                        disabled={processing}
                        className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20"
                    >
                        Update Password
                    </PrimaryButton>
                </div>
            </form>

            <Modal show={confirmingPasswordUpdate} onClose={() => setConfirmingPasswordUpdate(false)}>
                <div className="p-10">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-500/10 mb-6">
                        <ShieldCheck className="h-8 w-8 text-indigo-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-white text-center tracking-tight">
                        Confirm Password Change?
                    </h2>
                    <p className="mt-4 text-center text-gray-400 leading-relaxed">
                        Changing your password will update your login credentials. Make sure you remember your new password before confirming.
                    </p>

                    <div className="mt-10 flex justify-center space-x-3">
                        <SecondaryButton 
                            onClick={() => setConfirmingPasswordUpdate(false)}
                            className="px-8 py-4 bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 rounded-xl"
                        >
                            Cancel
                        </SecondaryButton>

                        <PrimaryButton 
                            onClick={submit}
                            className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20"
                        >
                            Confirm & Update
                        </PrimaryButton>
                    </div>
                </div>
            </Modal>
        </section>
    );
}
