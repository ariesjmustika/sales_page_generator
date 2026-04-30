import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import {
    AlertTriangle,
    DollarSign,
    History,
    Package,
    Plus,
    Sparkles,
    Star,
    Target,
    Trash2,
    X,
    Zap,
    Home,
    User,
    Settings,
    Sun,
    Moon,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface SalesPage {
    id: number;
    uuid: string;
    product_name: string;
    created_at: string;
    status: string;
    views_count: number;
}

export default function Dashboard({
    auth,
    salesPages,
}: PageProps<{ salesPages: SalesPage[] }>) {
    const [deleteUuid, setDeleteUuid] = useState<string | null>(null);
    const [theme, setTheme] = useState('dark');
    const [loadingStep, setLoadingStep] = useState(0);
    const [showUserMenu, setShowUserMenu] = useState(false);

    useEffect(() => {
        const handleThemeChange = () => {
            const savedTheme = localStorage.getItem('theme') || 'dark';
            setTheme(savedTheme);
        };
        handleThemeChange();
        window.addEventListener('theme-changed', handleThemeChange);
        return () => window.removeEventListener('theme-changed', handleThemeChange);
    }, []);

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);
    const loadingMessages = [
        'Analyzing your product details...',
        'Crafting high-converting headlines...',
        'Structuring benefits using AIDA framework...',
        'Polishing your call-to-actions...',
        'Optimizing for maximum conversion...',
        'Finalizing your premium sales page...',
    ];

    const { data, setData, post, processing, reset, errors } = useForm({
        product_name: '',
        target_audience: '',
        product_description: '',
        features: [''],
        price: '',
        usp: '',
        tone: 'professional',
    });

    const addFeature = () => setData('features', [...data.features, '']);

    const removeFeature = (index: number) => {
        const newFeatures = [...data.features];
        newFeatures.splice(index, 1);
        setData('features', newFeatures);
    };

    const handleFeatureChange = (index: number, value: string) => {
        const newFeatures = [...data.features];
        newFeatures[index] = value;
        setData('features', newFeatures);
    };

    useEffect(() => {
        let interval: any;
        if (processing) {
            interval = setInterval(() => {
                setLoadingStep((prev) => (prev + 1) % loadingMessages.length);
            }, 3000);
        } else {
            setLoadingStep(0);
        }
        return () => clearInterval(interval);
    }, [processing]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        // Manual validation checks to match Login behavior
        if (!data.product_name) {
            toast.error('Product Name is required!');
            return;
        }
        if (!data.target_audience) {
            toast.error('Target Audience is required!');
            return;
        }
        if (!data.product_description) {
            toast.error('Product Description is required!');
            return;
        }
        if (!data.price) {
            toast.error('Price is required!');
            return;
        }
        if (!data.usp) {
            toast.error('Unique Selling Point is required!');
            return;
        }
        // Check features
        const emptyFeatureIndex = data.features.findIndex(f => !f.trim());
        if (emptyFeatureIndex !== -1) {
            toast.error(`Key Feature #${emptyFeatureIndex + 1} cannot be empty!`);
            return;
        }

        post(route('sales-pages.store'), {
            onSuccess: () => {
                toast.success('Sales Page is being crafted by AI!');
                reset();
            },
            onError: () => {
                toast.error('Please fix the errors in the form.');
            }
        });
    };

    const handleDelete = () => {
        if (!deleteUuid) return;
        router.delete(route('sales-pages.destroy', deleteUuid), {
            onSuccess: () => {
                toast.success('Page deleted successfully');
                setDeleteUuid(null);
            },
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-2xl font-black tracking-tight dark:text-white text-slate-900 transition-colors">
                    MarketAI Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            {/* Custom Delete Modal */}
            <AnimatePresence>
                {deleteUuid && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setDeleteUuid(null)}
                            className="absolute inset-0 backdrop-blur-sm transition-colors duration-500 dark:bg-black/60 bg-white/40"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative w-full max-w-md rounded-[2rem] border dark:border-white/10 border-slate-200 dark:bg-[#1a1a24] bg-white p-8 shadow-2xl"
                        >
                            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10">
                                <AlertTriangle className="h-8 w-8 text-red-500" />
                            </div>
                            <h3 className="mb-2 text-center text-2xl font-bold dark:text-white text-slate-900">
                                Delete Page?
                            </h3>
                            <p className="mb-8 text-center text-gray-500 dark:text-gray-400">
                                This action cannot be undone. All AI-generated
                                content for this page will be lost forever.
                            </p>
                            <div className="flex space-x-3">
                                <button
                                    onClick={() => setDeleteUuid(null)}
                                    className="flex-1 rounded-2xl dark:bg-white/5 bg-slate-100 px-6 py-4 font-bold dark:text-white text-slate-600 transition-all hover:bg-slate-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="flex-1 rounded-2xl bg-red-600 px-6 py-4 font-bold text-white shadow-lg shadow-red-600/20 transition-all hover:bg-red-700"
                                >
                                    Delete Now
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <div className="py-12 transition-colors duration-500">
                <div className="mx-auto max-w-7xl space-y-8 sm:px-6 lg:px-8">
                    {/* AI System Status */}
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-4 flex flex-col items-center justify-between rounded-[2rem] border dark:border-indigo-500/10 border-indigo-600/10 dark:bg-indigo-500/5 bg-indigo-600/5 p-6 backdrop-blur-xl md:flex-row shadow-sm"
                    >
                        <div className="mb-4 flex items-center space-x-4 md:mb-0">
                            <div className="relative">
                                <div className="absolute inset-0 h-3 w-3 animate-ping rounded-full bg-green-500" />
                                <div className="relative h-3 w-3 rounded-full bg-green-500" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold tracking-tight dark:text-white text-slate-900">
                                    AI Multi-Model Engine:{' '}
                                    <span className="text-green-500">
                                        Operational
                                    </span>
                                </h4>
                                <p className="mt-1 text-[10px] font-black uppercase tracking-widest text-gray-500">
                                    Primary: Gemini 2.5 Flash • Secondary:
                                    Gemini 2.0 Flash
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2 rounded-xl border dark:border-white/5 border-slate-200 dark:bg-black/40 bg-white px-4 py-2 shadow-sm">
                            <Sparkles className="h-3 w-3 text-indigo-400" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                                Auto-Failover Discovery Active
                            </span>
                        </div>
                    </motion.div>

                    {/* Stats Overview */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="grid grid-cols-1 gap-6 md:grid-cols-4"
                    >
                        <StatsCard
                            icon={
                                <Package className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                            }
                            label="Total Projects"
                            value={salesPages.length}
                        />
                        <StatsCard
                            icon={<Target className="h-5 w-5 text-green-600 dark:text-green-400" />}
                            label="Total Views"
                            value={salesPages.reduce(
                                (acc, p) => acc + (p.views_count || 0),
                                0,
                            )}
                        />
                        <StatsCard
                            icon={<Zap className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />}
                            label="AI Generations"
                            value={salesPages.length * 4}
                        />
                        <StatsCard
                            icon={<Star className="h-5 w-5 text-purple-600 dark:text-purple-400" />}
                            label="Conversion Score"
                            value="A+"
                        />
                    </motion.div>

                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                        {/* Form Section */}
                        <div className="lg:col-span-2">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="overflow-hidden rounded-[2.5rem] border dark:border-white/10 border-slate-200 dark:bg-[#121217] bg-white p-8 shadow-xl md:p-10 transition-all"
                            >
                                <div className="mb-10 flex items-center space-x-3">
                                    <div className="rounded-2xl bg-indigo-500/10 p-3">
                                        <Sparkles className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold dark:text-white text-slate-900">
                                            Generate Sales Page
                                        </h3>
                                        <p className="text-sm text-gray-500">
                                            Let AI craft your high-converting
                                            copy
                                        </p>
                                    </div>
                                </div>

                                <form onSubmit={submit} className="space-y-8">
                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <label className="flex items-center space-x-2 text-sm font-bold uppercase tracking-widest text-gray-500">
                                                <Package className="h-4 w-4" />
                                                <span>Product Name</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={data.product_name}
                                                onChange={(e) =>
                                                    setData(
                                                        'product_name',
                                                        e.target.value,
                                                    )
                                                }
                                                className={`w-full rounded-2xl border px-5 py-4 outline-none transition-all focus:ring-2 focus:ring-indigo-500 placeholder:text-gray-400 ${
                                                    theme === 'dark' 
                                                    ? `dark:bg-white/5 dark:text-white ${errors.product_name ? 'border-red-500/50 bg-red-500/5 ring-1 ring-red-500/20' : 'border-white/10'}` 
                                                    : `bg-slate-50 text-slate-900 ${errors.product_name ? 'border-red-300 bg-red-50' : 'border-slate-200'}`
                                                }`}
                                                placeholder="e.g. SaaS Pro Max"
                                               
                                            />
                                            <AnimatePresence>
                                                {errors.product_name && (
                                                    <motion.p 
                                                        initial={{ opacity: 0, y: -10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        className="mt-1 text-xs font-bold text-red-500"
                                                    >
                                                        {errors.product_name}
                                                    </motion.p>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="flex items-center space-x-2 text-sm font-bold uppercase tracking-widest text-gray-500">
                                                <Target className="h-4 w-4" />
                                                <span>Target Audience</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={data.target_audience}
                                                onChange={(e) =>
                                                    setData(
                                                        'target_audience',
                                                        e.target.value,
                                                    )
                                                }
                                                className={`w-full rounded-2xl border px-5 py-4 outline-none transition-all focus:ring-2 focus:ring-indigo-500 placeholder:text-gray-400 ${
                                                    theme === 'dark' 
                                                    ? `dark:bg-white/5 dark:text-white ${errors.target_audience ? 'border-red-500/50 bg-red-500/5 ring-1 ring-red-500/20' : 'border-white/10'}` 
                                                    : `bg-slate-50 text-slate-900 ${errors.target_audience ? 'border-red-300 bg-red-50' : 'border-slate-200'}`
                                                }`}
                                                placeholder="e.g. Freelance Designers"
                                               
                                            />
                                            <AnimatePresence>
                                                {errors.target_audience && (
                                                    <motion.p 
                                                        initial={{ opacity: 0, y: -10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        className="mt-1 text-xs font-bold text-red-500"
                                                    >
                                                        {errors.target_audience}
                                                    </motion.p>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold uppercase tracking-widest text-gray-500">
                                            Description
                                        </label>
                                        <textarea
                                            value={data.product_description}
                                            onChange={(e) =>
                                                setData(
                                                    'product_description',
                                                    e.target.value,
                                                )
                                            }
                                            className={`min-h-[120px] w-full rounded-2xl border px-5 py-4 outline-none transition-all focus:ring-2 focus:ring-indigo-500 placeholder:text-gray-400 ${
                                                theme === 'dark' 
                                                ? `dark:bg-white/5 dark:text-white ${errors.product_description ? 'border-red-500/50 bg-red-500/5 ring-1 ring-red-500/20' : 'border-white/10'}` 
                                                : `bg-slate-50 text-slate-900 ${errors.product_description ? 'border-red-300 bg-red-50' : 'border-slate-200'}`
                                            }`}
                                            placeholder="What does your product do?"
                                           
                                        />
                                        <AnimatePresence>
                                            {errors.product_description && (
                                                <motion.p 
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="mt-1 text-xs font-bold text-red-500"
                                                >
                                                    {errors.product_description}
                                                </motion.p>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <label className="flex items-center space-x-2 text-sm font-bold uppercase tracking-widest text-gray-500">
                                                <DollarSign className="h-4 w-4" />
                                                <span>Price</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={data.price}
                                                onChange={(e) =>
                                                    setData(
                                                        'price',
                                                        e.target.value,
                                                    )
                                                }
                                                className={`w-full rounded-2xl border px-5 py-4 outline-none transition-all focus:ring-2 focus:ring-indigo-500 placeholder:text-gray-400 ${
                                                    theme === 'dark' 
                                                    ? `dark:bg-white/5 dark:text-white ${errors.price ? 'border-red-500/50 bg-red-500/5 ring-1 ring-red-500/20' : 'border-white/10'}` 
                                                    : `bg-slate-50 text-slate-900 ${errors.price ? 'border-red-300 bg-red-50' : 'border-slate-200'}`
                                                }`}
                                                placeholder="e.g. $49/month"
                                               
                                            />
                                            <AnimatePresence>
                                                {errors.price && (
                                                    <motion.p 
                                                        initial={{ opacity: 0, y: -10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        className="mt-1 text-xs font-bold text-red-500"
                                                    >
                                                        {errors.price}
                                                    </motion.p>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="flex items-center space-x-2 text-sm font-bold uppercase tracking-widest text-gray-500">
                                                <span>Tone</span>
                                            </label>
                                            <select
                                                value={data.tone}
                                                onChange={(e) =>
                                                    setData(
                                                        'tone',
                                                        e.target.value,
                                                    )
                                                }
                                                className={`w-full appearance-none rounded-2xl border px-5 py-4 outline-none transition-all focus:ring-2 focus:ring-indigo-500 ${
                                                    theme === 'dark' 
                                                    ? `dark:bg-white/5 dark:text-white ${errors.tone ? 'border-red-500/50 bg-red-500/5 ring-1 ring-red-500/20' : 'border-white/10'}` 
                                                    : `bg-slate-50 text-slate-900 ${errors.tone ? 'border-red-300 bg-red-50' : 'border-slate-200'}`
                                                }`}
                                            >
                                                <option value="professional" className="dark:bg-[#1a1a24] bg-white">Professional</option>
                                                <option value="persuasive" className="dark:bg-[#1a1a24] bg-white">Persuasive</option>
                                                <option value="witty" className="dark:bg-[#1a1a24] bg-white">Witty & Fun</option>
                                                <option value="urgent" className="dark:bg-[#1a1a24] bg-white">Urgent/Scarcity</option>
                                                <option value="friendly" className="dark:bg-[#1a1a24] bg-white">Friendly</option>
                                                <option value="minimalist" className="dark:bg-[#1a1a24] bg-white">Minimalist</option>
                                            </select>
                                            <AnimatePresence>
                                                {errors.tone && (
                                                    <motion.p 
                                                        initial={{ opacity: 0, y: -10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        className="mt-1 text-xs font-bold text-red-500"
                                                    >
                                                        {errors.tone}
                                                    </motion.p>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="flex items-center space-x-2 text-sm font-bold uppercase tracking-widest text-gray-500">
                                            <Star className="h-4 w-4" />
                                            <span>Unique Selling Point (USP)</span>
                                        </label>
                                        <textarea
                                            value={data.usp}
                                            onChange={(e) =>
                                                setData('usp', e.target.value)
                                            }
                                            className={`min-h-[80px] w-full rounded-2xl border px-5 py-4 outline-none transition-all focus:ring-2 focus:ring-indigo-500 placeholder:text-gray-400 ${
                                                theme === 'dark' 
                                                ? `dark:bg-white/5 dark:text-white ${errors.usp ? 'border-red-500/50 bg-red-500/5 ring-1 ring-red-500/20' : 'border-white/10'}` 
                                                : `bg-slate-50 text-slate-900 ${errors.usp ? 'border-red-300 bg-red-50' : 'border-slate-200'}`
                                            }`}
                                            placeholder="What makes your product special?"
                                           
                                        />
                                        <AnimatePresence>
                                            {errors.usp && (
                                                <motion.p 
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="mt-1 text-xs font-bold text-red-500"
                                                >
                                                    {errors.usp}
                                                </motion.p>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <label className="text-sm font-bold uppercase tracking-widest text-gray-500">
                                                Key Features
                                            </label>
                                            <button
                                                type="button"
                                                onClick={addFeature}
                                                className="flex items-center space-x-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:opacity-80"
                                            >
                                                <Plus className="h-3 w-3" />
                                                <span>Add New</span>
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                            {data.features.map(
                                                (feature, index) => (
                                                    <div
                                                        key={index}
                                                        className="group relative"
                                                    >
                                                        <input
                                                            type="text"
                                                            value={feature}
                                                            onChange={(e) =>
                                                                handleFeatureChange(
                                                                    index,
                                                                    e.target.value,
                                                                )
                                                            }
                                                            className={`w-full rounded-2xl border px-5 py-4 pr-12 outline-none transition-all focus:ring-2 focus:ring-indigo-500 ${
                                                                theme === 'dark' 
                                                                ? `dark:bg-white/5 dark:text-white ${errors[`features.${index}`] ? 'border-red-500/50 bg-red-500/5 ring-1 ring-red-500/20' : 'border-white/10'}` 
                                                                : `bg-slate-50 text-slate-900 ${errors[`features.${index}`] ? 'border-red-300 bg-red-50' : 'border-slate-200'}`
                                                            }`}
                                                           
                                                        />
                                                        {data.features.length > 1 && (
                                                            <button
                                                                type="button"
                                                                onClick={() => removeFeature(index)}
                                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-red-500"
                                                            >
                                                                <X className="h-4 w-4" />
                                                            </button>
                                                        )}
                                                        <AnimatePresence>
                                                            {errors[`features.${index}`] && (
                                                                <motion.p 
                                                                    initial={{ opacity: 0, y: -10 }}
                                                                    animate={{ opacity: 1, y: 0 }}
                                                                    className="mt-1 text-xs font-bold text-red-500"
                                                                >
                                                                    {errors[`features.${index}`]}
                                                                </motion.p>
                                                            )}
                                                        </AnimatePresence>
                                                    </div>
                                                ),
                                            )}
                                        </div>
                                    </div>

                                    <div className="pt-6">
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="flex w-full transform items-center justify-center space-x-3 rounded-2xl bg-indigo-600 px-10 py-5 font-bold text-white shadow-xl shadow-indigo-600/20 transition-all hover:bg-indigo-700 active:scale-[0.98] disabled:opacity-50 md:w-auto"
                                        >
                                            {processing ? (
                                                <div className="flex items-center space-x-3">
                                                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                                    <motion.span
                                                        key={loadingStep}
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        className="text-sm font-medium"
                                                    >
                                                        {loadingMessages[loadingStep]}
                                                    </motion.span>
                                                </div>
                                            ) : (
                                                <>
                                                    <Sparkles className="h-5 w-5" />
                                                    <span className="hidden sm:inline">Craft My Sales Page</span>
                                                    <span className="sm:hidden">Generate Page</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        </div>

                        {/* History Section */}
                        <div className="lg:col-span-1">
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="rounded-[2.5rem] border dark:border-white/10 border-slate-200 dark:bg-[#121217] bg-white p-8 shadow-xl"
                            >
                                <div className="mb-8 flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <History className="h-5 w-5 text-gray-500" />
                                        <h3 className="text-xl font-bold dark:text-white text-slate-900">
                                            History
                                        </h3>
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                                        {salesPages.length} Pages
                                    </span>
                                </div>

                                <div className="space-y-4">
                                    {salesPages.length === 0 ? (
                                        <div className="py-10 text-center">
                                            <p className="text-sm italic text-gray-500">
                                                No pages generated yet.
                                            </p>
                                        </div>
                                    ) : (
                                        salesPages.map((page) => (
                                            <div
                                                key={page.id}
                                                className="group relative"
                                            >
                                                <Link
                                                    href={route('sales-pages.show', page.uuid)}
                                                    className="block"
                                                >
                                                    <div className="rounded-2xl border dark:border-white/5 border-slate-100 dark:bg-white/5 bg-slate-50 p-5 pr-12 transition-all group-hover:border-indigo-500/30 group-hover:bg-indigo-500/5">
                                                        <h4 className="mb-1 truncate font-bold dark:text-white text-slate-800 transition-colors group-hover:text-indigo-600">
                                                            {page.product_name}
                                                        </h4>
                                                        <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-gray-500">
                                                            <span>
                                                                {new Date(page.created_at).toLocaleDateString()}
                                                            </span>
                                                            <span className="flex items-center space-x-1">
                                                                <Target className="h-3 w-3" />
                                                                <span>{page.views_count} Views</span>
                                                            </span>
                                                        </div>
                                                    </div>
                                                </Link>
                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        setDeleteUuid(page.uuid);
                                                    }}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-400 opacity-0 transition-all hover:text-red-500 group-hover:opacity-100"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Global Bottom Navigation Bar */}
            <div className="lg:hidden fixed bottom-6 left-0 right-0 z-[100] px-4">
                <AnimatePresence>
                    {/* User Menu Sheet (Right) */}
                    {showUserMenu && (
                        <>
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowUserMenu(false)} className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
                            <motion.div 
                                initial={{ y: 20, opacity: 0, scale: 0.95 }} 
                                animate={{ y: 0, opacity: 1, scale: 1 }} 
                                exit={{ y: 20, opacity: 0, scale: 0.95 }} 
                                className={`absolute bottom-24 right-4 w-64 rounded-3xl border p-3 shadow-2xl ${
                                    theme === 'dark' ? 'border-white/10 bg-[#1a1a24] text-white' : 'border-indigo-100 bg-white text-slate-900'
                                }`}
                            >
                                <div className="space-y-1">
                                    <Link href={route('profile.edit')} className="flex w-full items-center space-x-3 rounded-xl p-3 transition-all hover:bg-indigo-500/10">
                                        <User className="h-5 w-5 text-indigo-400" />
                                        <span className="font-bold text-sm">Profile Settings</span>
                                    </Link>
                                    <button 
                                        onClick={() => { 
                                            const newTheme = theme === 'dark' ? 'light' : 'dark';
                                            localStorage.setItem('theme', newTheme);
                                            window.dispatchEvent(new Event('theme-changed'));
                                            setShowUserMenu(false); 
                                        }} 
                                        className="flex w-full items-center space-x-3 rounded-xl p-3 transition-all hover:bg-indigo-500/10"
                                    >
                                        {theme === 'dark' ? <Sun className="h-5 w-5 text-yellow-500" /> : <Moon className="h-5 w-5 text-indigo-500" />}
                                        <span className="font-bold text-sm">Switch to {theme === 'dark' ? 'Light' : 'Dark'}</span>
                                    </button>
                                    <div className="h-px bg-white/5 my-1" />
                                    <Link method="post" href={route('logout')} as="button" className="flex w-full items-center space-x-3 rounded-xl p-3 transition-all hover:bg-red-500/10 text-red-500">
                                        <Trash2 className="h-5 w-5" />
                                        <span className="font-bold text-sm">Log Out</span>
                                    </Link>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>

                <motion.div 
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className={`relative mx-auto flex max-w-md items-center justify-between rounded-[2.5rem] border p-2 shadow-2xl backdrop-blur-2xl ${
                        theme === 'dark' 
                        ? 'border-white/10 bg-black/60 shadow-black/40' 
                        : 'border-indigo-100 bg-white/80 shadow-indigo-600/10'
                    }`}
                >
                    {/* Home (Active) */}
                    <div
                        className={`flex flex-1 flex-col items-center justify-center rounded-2xl py-2 ${
                            theme === 'dark' ? 'bg-white/5 text-indigo-400' : 'bg-indigo-50 text-indigo-600 shadow-sm shadow-indigo-600/10'
                        }`}
                    >
                        <Home className="h-5 w-5" />
                        <span className="mt-1 text-[8px] font-bold uppercase tracking-widest">Home</span>
                    </div>

                    {/* Center Action: Create New */}
                    <div className="relative px-2">
                        <button
                            onClick={() => {
                                document.getElementById('product-form')?.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-600 text-white shadow-xl shadow-indigo-600/40 transition-all active:scale-90"
                        >
                            <Plus className="h-8 w-8" />
                        </button>
                    </div>

                    {/* User Menu Toggle */}
                    <button
                        onClick={() => setShowUserMenu(!showUserMenu)}
                        className={`flex flex-1 flex-col items-center justify-center rounded-2xl py-2 transition-all active:scale-90 ${
                            theme === 'dark' ? 'text-gray-400 hover:bg-white/5' : 'text-slate-500 hover:bg-slate-50'
                        }`}
                    >
                        <User className="h-5 w-5" />
                        <span className="mt-1 text-[8px] font-bold uppercase tracking-widest">Account</span>
                    </button>
                </motion.div>
            </div>

        </AuthenticatedLayout>
    );
}

function StatsCard({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value: string | number;
}) {
    return (
        <div className="group flex items-center space-x-4 rounded-3xl border dark:border-white/10 border-slate-200 dark:bg-[#121217] bg-white p-6 shadow-sm transition-all hover:border-indigo-500/30 hover:shadow-md">
            <div className="rounded-2xl dark:bg-white/5 bg-slate-50 p-3 transition-transform group-hover:scale-110">
                {icon}
            </div>
            <div>
                <div className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                    {label}
                </div>
                <div className="text-2xl font-black dark:text-white text-slate-900 transition-colors">{value}</div>
            </div>
        </div>
    );
}
