import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
}: {
    mustVerifyEmail: boolean;
    status?: string;
    className?: string;
}) {
    const user = usePage().props.auth.user;
    const [confirmingUpdate, setConfirmingUpdate] = useState(false);
    const nameInput = useRef<HTMLInputElement>(null);

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
        });

    const requestUpdate: FormEventHandler = (e) => {
        e.preventDefault();
        
        if (!data.name.trim()) {
            toast.error('Name cannot be empty!');
            nameInput.current?.focus();
            return;
        }

        setConfirmingUpdate(true);
    };

    const submit = () => {
        setConfirmingUpdate(false);
        patch(route('profile.update'), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Profile information updated successfully!');
            },
            onError: () => {
                toast.error('Failed to update profile information.');
                nameInput.current?.focus();
            }
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
                                    <Sparkles className="h-6 w-6 text-indigo-400" />
                                </div>
                            </div>
                            <h2 className="text-xl font-bold text-white tracking-tight animate-pulse">Updating Profile...</h2>
                            <p className="text-sm text-gray-500 mt-2 uppercase tracking-[0.2em] font-black">Syncing Information</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <header>
                <h2 className="text-xl font-bold text-white tracking-tight">
                    Profile Information
                </h2>

                <p className="mt-1 text-sm text-gray-400">
                    Update your account's profile information.
                </p>
            </header>

            <form onSubmit={requestUpdate} className="mt-8 space-y-6">
                <div>
                    <InputLabel htmlFor="name" value="Name" className="text-gray-300 mb-2" />

                    <TextInput
                        id="name"
                        ref={nameInput}
                        className={`mt-1 block w-full bg-white/5 border-white/10 text-white focus:border-indigo-500 focus:ring-indigo-500 rounded-xl py-4 transition-all ${errors.name ? 'border-red-500/50 bg-red-500/5' : ''}`}
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        autoComplete="name"
                    />

                    <AnimatePresence>
                        {errors.name && (
                            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                                <InputError className="mt-2" message={errors.name} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div>
                    <div className="flex items-center justify-between mb-2">
                        <InputLabel htmlFor="email" value="Email Address" className="text-gray-300" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 bg-white/5 px-2 py-1 rounded-md border border-white/5">Verified & Locked</span>
                    </div>

                    <TextInput
                        id="email"
                        type="email"
                        className="mt-1 block w-full bg-white/5 border-white/10 text-gray-500 cursor-not-allowed rounded-xl py-4"
                        value={data.email}
                        disabled
                    />
                    <p className="mt-2 text-[10px] text-gray-500 uppercase tracking-widest">Email cannot be changed for security reasons.</p>
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div className="rounded-2xl bg-amber-500/10 border border-amber-500/20 p-4">
                        <p className="text-sm text-amber-400">
                            Your email address is unverified.
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className="ml-2 font-bold underline hover:text-amber-300"
                            >
                                Click here to re-send the verification email.
                            </Link>
                        </p>

                        {status === 'verification-link-sent' && (
                            <div className="mt-2 text-sm font-medium text-green-400">
                                A new verification link has been sent to your
                                email address.
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-4 pt-4">
                    <PrimaryButton 
                        disabled={processing}
                        className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20"
                    >
                        Save Changes
                    </PrimaryButton>
                </div>
            </form>

            <Modal show={confirmingUpdate} onClose={() => setConfirmingUpdate(false)}>
                <div className="p-10">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-500/10 mb-6">
                        <AlertCircle className="h-8 w-8 text-indigo-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-white text-center tracking-tight">
                        Confirm Profile Update?
                    </h2>
                    <p className="mt-4 text-center text-gray-400 leading-relaxed">
                        Are you sure you want to update your account information? This will sync your profile data across the platform.
                    </p>

                    <div className="mt-10 flex justify-center space-x-3">
                        <SecondaryButton 
                            onClick={() => setConfirmingUpdate(false)}
                            className="px-8 py-4 bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 rounded-xl"
                        >
                            Cancel
                        </SecondaryButton>

                        <PrimaryButton 
                            onClick={submit}
                            className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20"
                        >
                            Confirm & Save
                        </PrimaryButton>
                    </div>
                </div>
            </Modal>
        </section>
    );
}
