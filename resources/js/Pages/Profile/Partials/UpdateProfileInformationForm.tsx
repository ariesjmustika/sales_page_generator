import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import { Link, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useState, useRef, useEffect } from 'react';
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
    const [theme, setTheme] = useState('dark');

    useEffect(() => {
        setTheme(localStorage.getItem('theme') || 'dark');
    }, []);

    const { data, setData, patch, errors, processing } =
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
                        className={`fixed inset-0 z-[100] flex items-center justify-center backdrop-blur-md ${theme === 'dark' ? 'bg-[#0a0a0c]/80' : 'bg-white/80'}`}
                    >
                        <div className="text-center">
                            <div className="relative mx-auto mb-6 h-20 w-20">
                                <div className="absolute inset-0 animate-spin rounded-full border-4 border-indigo-500/20 border-t-indigo-500"></div>
                                <div className="absolute inset-4 animate-pulse rounded-full bg-indigo-500/20 flex items-center justify-center">
                                    <Sparkles className="h-6 w-6 text-indigo-400" />
                                </div>
                            </div>
                            <h2 className={`text-xl font-bold tracking-tight animate-pulse ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Updating Profile...</h2>
                            <p className="text-sm text-gray-500 mt-2 uppercase tracking-[0.2em] font-black">Syncing Information</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <header>
                <h2 className={`text-xl font-bold tracking-tight transition-colors ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                    Profile Information
                </h2>

                <p className="mt-1 text-sm text-gray-400">
                    Update your account's profile information.
                </p>
            </header>

            <form onSubmit={requestUpdate} className="mt-8 space-y-6">
                <div>
                    <InputLabel htmlFor="name" value="Name" className={`mb-2 transition-colors ${theme === 'dark' ? 'text-gray-300' : 'text-slate-600'}`} />

                    <TextInput
                        id="name"
                        ref={nameInput}
                        className={`mt-1 block w-full rounded-xl py-4 transition-all ${
                            theme === 'dark'
                            ? 'bg-white/5 border-white/10 text-white'
                            : 'bg-slate-50 border-slate-200 text-slate-900'
                        } focus:border-indigo-500 focus:ring-indigo-500 ${errors.name ? 'border-red-500/50 bg-red-500/5' : ''}`}
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
                        <InputLabel htmlFor="email" value="Email Address" className={`transition-colors ${theme === 'dark' ? 'text-gray-300' : 'text-slate-600'}`} />
                        <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md border transition-all ${
                            theme === 'dark' 
                            ? 'text-gray-500 bg-white/5 border-white/5' 
                            : 'text-indigo-600 bg-indigo-50 border-indigo-100'
                        }`}>Verified & Locked</span>
                    </div>

                    <TextInput
                        id="email"
                        type="email"
                        className={`mt-1 block w-full cursor-not-allowed rounded-xl py-4 transition-all ${
                            theme === 'dark'
                            ? 'bg-white/5 border-white/10 text-gray-500'
                            : 'bg-slate-100 border-slate-200 text-slate-400'
                        }`}
                        value={data.email}
                        disabled
                    />
                    <p className="mt-2 text-[10px] text-gray-500 uppercase tracking-widest">Email cannot be changed for security reasons.</p>
                </div>

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
                <div className={`p-10 transition-colors duration-500 ${theme === 'dark' ? 'bg-[#1a1a24]' : 'bg-white'}`}>
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-500/10 mb-6">
                        <AlertCircle className="h-8 w-8 text-indigo-500" />
                    </div>
                    <h2 className={`text-2xl font-bold text-center tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                        Confirm Profile Update?
                    </h2>
                    <p className="mt-4 text-center text-gray-400 leading-relaxed">
                        Are you sure you want to update your account information? This will sync your profile data across the platform.
                    </p>

                    <div className="mt-10 flex justify-center space-x-3">
                        <SecondaryButton 
                            onClick={() => setConfirmingUpdate(false)}
                            className={`px-8 py-4 border rounded-xl transition-all ${
                                theme === 'dark' 
                                ? 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10' 
                                : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'
                            }`}
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
