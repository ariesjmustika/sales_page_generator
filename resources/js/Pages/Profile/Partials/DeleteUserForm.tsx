import DangerButton from '@/Components/DangerButton';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import { useForm } from '@inertiajs/react';
import { FormEventHandler, useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

export default function DeleteUserForm({
    className = '',
}: {
    className?: string;
}) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef<HTMLInputElement>(null);
    const [theme, setTheme] = useState('dark');

    useEffect(() => {
        setTheme(localStorage.getItem('theme') || 'dark');
    }, []);

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        password: '',
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser: FormEventHandler = (e) => {
        e.preventDefault();

        if (!data.password) {
            toast.error('Please enter your password to confirm account deletion.');
            passwordInput.current?.focus();
            return;
        }

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => {
                passwordInput.current?.focus();
                toast.error('Incorrect password. Please try again.');
            },
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);

        clearErrors();
        reset();
    };

    return (
        <section className={`space-y-6 ${className}`}>
            <AnimatePresence>
                {processing && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className={`fixed inset-0 z-[100] flex items-center justify-center backdrop-blur-md ${theme === 'dark' ? 'bg-red-950/20' : 'bg-red-50/50'}`}
                    >
                        <div className="text-center">
                            <div className="relative mx-auto mb-6 h-20 w-20">
                                <div className="absolute inset-0 animate-spin rounded-full border-4 border-red-500/20 border-t-red-500"></div>
                                <div className="absolute inset-4 animate-pulse rounded-full bg-red-500/20 flex items-center justify-center">
                                    <Trash2 className="h-6 w-6 text-red-500" />
                                </div>
                            </div>
                            <h2 className={`text-xl font-bold tracking-tight animate-pulse ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                                Deleting Account...
                            </h2>
                            <p className="mt-2 font-black uppercase tracking-[0.2em] text-[10px] text-red-500/60">
                                Finalizing Action
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            <header>
                <div className="flex items-center space-x-3 mb-2 text-red-500 transition-transform hover:scale-[1.01] origin-left">
                    <AlertTriangle className="h-5 w-5" />
                    <h2 className="text-xl font-bold tracking-tight">
                        Delete Account
                    </h2>
                </div>

                <p className="mt-1 text-sm text-gray-400 leading-relaxed">
                    Once your account is deleted, all of its resources and data
                    will be permanently deleted. Before deleting your account,
                    please download any data or information that you wish to
                    retain.
                </p>
            </header>

            <DangerButton 
                onClick={confirmUserDeletion}
                className="px-8 py-4 bg-red-600 hover:bg-red-700 rounded-xl shadow-lg shadow-red-600/20 font-bold uppercase tracking-widest text-xs"
            >
                Delete Account
            </DangerButton>

            <Modal show={confirmingUserDeletion} onClose={closeModal}>
                <form onSubmit={deleteUser} className={`p-10 transition-colors duration-500 ${theme === 'dark' ? 'bg-[#1a1a24]' : 'bg-white'}`}>
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 mb-6">
                        <Trash2 className="h-8 w-8 text-red-500" />
                    </div>

                    <h2 className={`text-2xl font-bold text-center tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                        Are you sure you want to delete your account?
                    </h2>

                    <p className="mt-4 text-center text-gray-400 leading-relaxed">
                        Once your account is deleted, all of its resources and
                        data will be permanently deleted. Please enter your
                        password to confirm you would like to permanently delete
                        your account.
                    </p>

                    <div className="mt-8">
                        <InputLabel
                            htmlFor="password"
                            value="Password"
                            className="sr-only"
                        />

                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(e) =>
                                setData('password', e.target.value)
                            }
                            className={`mt-1 block w-full rounded-xl py-4 transition-all ${
                                theme === 'dark'
                                ? 'bg-white/5 border-white/10 text-white'
                                : 'bg-slate-50 border-slate-200 text-slate-900'
                            } focus:border-red-500 focus:ring-red-500 ${errors.password ? 'border-red-500 bg-red-500/5' : ''}`}
                            isFocused
                            placeholder="Enter your password to confirm"
                        />

                        <AnimatePresence>
                            {errors.password && (
                                <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}>
                                    <InputError
                                        message={errors.password}
                                        className="mt-2"
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="mt-10 flex justify-center space-x-3">
                        <SecondaryButton 
                            onClick={closeModal}
                            className={`px-8 py-4 border rounded-xl transition-all ${
                                theme === 'dark' 
                                ? 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10' 
                                : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'
                            }`}
                        >
                            Cancel
                        </SecondaryButton>

                        <DangerButton 
                            className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg shadow-red-600/20 uppercase tracking-widest text-xs transition-all hover:scale-105 active:scale-95" 
                            disabled={processing}
                        >
                            Confirm Deletion
                        </DangerButton>
                    </div>
                </form>
            </Modal>
        </section>
    );
}
