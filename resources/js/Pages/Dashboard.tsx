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
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Toaster, toast } from 'sonner';

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
    const [loadingStep, setLoadingStep] = useState(0);
    const loadingMessages = [
        'Analyzing your product details...',
        'Crafting high-converting headlines...',
        'Structuring benefits using AIDA framework...',
        'Polishing your call-to-actions...',
        'Optimizing for maximum conversion...',
        'Finalizing your premium sales page...',
    ];

    const { data, setData, post, processing, reset } = useForm({
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
        post(route('sales-pages.store'), {
            onSuccess: () => {
                toast.success('Sales Page is being crafted by AI!');
                reset();
            },
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
                <h2 className="text-2xl font-bold leading-tight text-white">
                    MarketAI Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />
            <Toaster position="top-right" theme="dark" />

            {/* Custom Delete Modal */}
            <AnimatePresence>
                {deleteUuid && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setDeleteUuid(null)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative w-full max-w-md rounded-[2rem] border border-white/10 bg-[#1a1a24] p-8 shadow-2xl"
                        >
                            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10">
                                <AlertTriangle className="h-8 w-8 text-red-500" />
                            </div>
                            <h3 className="mb-2 text-center text-2xl font-bold text-white">
                                Delete Page?
                            </h3>
                            <p className="mb-8 text-center text-gray-400">
                                This action cannot be undone. All AI-generated
                                content for this page will be lost forever.
                            </p>
                            <div className="flex space-x-3">
                                <button
                                    onClick={() => setDeleteUuid(null)}
                                    className="flex-1 rounded-2xl bg-white/5 px-6 py-4 font-bold text-white transition-all hover:bg-white/10"
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

            <div className="min-h-screen bg-[#0a0a0c] py-12">
                <div className="mx-auto max-w-7xl space-y-8 sm:px-6 lg:px-8">
                    {/* AI System Status */}
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-4 flex flex-col items-center justify-between rounded-[2rem] border border-indigo-500/10 bg-indigo-500/5 p-6 backdrop-blur-xl md:flex-row"
                    >
                        <div className="mb-4 flex items-center space-x-4 md:mb-0">
                            <div className="relative">
                                <div className="absolute inset-0 h-3 w-3 animate-ping rounded-full bg-green-500" />
                                <div className="relative h-3 w-3 rounded-full bg-green-500" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold tracking-tight text-white">
                                    AI Multi-Model Engine:{' '}
                                    <span className="text-green-400">
                                        Operational
                                    </span>
                                </h4>
                                <p className="mt-1 text-[10px] font-black uppercase tracking-widest text-gray-500">
                                    Primary: Gemini 2.5 Flash • Secondary:
                                    Gemini 2.0 Flash
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2 rounded-xl border border-white/5 bg-black/40 px-4 py-2">
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
                                <Package className="h-5 w-5 text-indigo-400" />
                            }
                            label="Total Projects"
                            value={salesPages.length}
                        />
                        <StatsCard
                            icon={<Target className="h-5 w-5 text-green-400" />}
                            label="Total Views"
                            value={salesPages.reduce(
                                (acc, p) => acc + (p.views_count || 0),
                                0,
                            )}
                        />
                        <StatsCard
                            icon={<Zap className="h-5 w-5 text-yellow-400" />}
                            label="AI Generations"
                            value={salesPages.length * 4}
                        />
                        <StatsCard
                            icon={<Star className="h-5 w-5 text-purple-400" />}
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
                                className="overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#121217] p-8 shadow-2xl md:p-10"
                            >
                                <div className="mb-10 flex items-center space-x-3">
                                    <div className="rounded-2xl bg-indigo-500/10 p-3">
                                        <Sparkles className="h-6 w-6 text-indigo-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-white">
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
                                            <label className="flex items-center space-x-2 text-sm font-bold uppercase tracking-widest text-gray-400">
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
                                                className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-white outline-none transition-all focus:ring-2 focus:ring-indigo-500"
                                                placeholder="e.g. SaaS Pro Max"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="flex items-center space-x-2 text-sm font-bold uppercase tracking-widest text-gray-400">
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
                                                className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-white outline-none transition-all focus:ring-2 focus:ring-indigo-500"
                                                placeholder="e.g. Freelance Designers"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold uppercase tracking-widest text-gray-400">
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
                                            className="min-h-[120px] w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-white outline-none transition-all focus:ring-2 focus:ring-indigo-500"
                                            placeholder="What does your product do?"
                                            required
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <label className="flex items-center space-x-2 text-sm font-bold uppercase tracking-widest text-gray-400">
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
                                                className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-white outline-none transition-all focus:ring-2 focus:ring-indigo-500"
                                                placeholder="e.g. $49/month"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="flex items-center space-x-2 text-sm font-bold uppercase tracking-widest text-gray-400">
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
                                                className="w-full appearance-none rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-white outline-none transition-all focus:ring-2 focus:ring-indigo-500"
                                            >
                                                <option
                                                    value="professional"
                                                    className="bg-[#1a1a24]"
                                                >
                                                    Professional
                                                </option>
                                                <option
                                                    value="persuasive"
                                                    className="bg-[#1a1a24]"
                                                >
                                                    Persuasive
                                                </option>
                                                <option
                                                    value="witty"
                                                    className="bg-[#1a1a24]"
                                                >
                                                    Witty & Fun
                                                </option>
                                                <option
                                                    value="urgent"
                                                    className="bg-[#1a1a24]"
                                                >
                                                    Urgent/Scarcity
                                                </option>
                                                <option
                                                    value="friendly"
                                                    className="bg-[#1a1a24]"
                                                >
                                                    Friendly
                                                </option>
                                                <option
                                                    value="minimalist"
                                                    className="bg-[#1a1a24]"
                                                >
                                                    Minimalist
                                                </option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="flex items-center space-x-2 text-sm font-bold uppercase tracking-widest text-gray-400">
                                            <Star className="h-4 w-4" />
                                            <span>
                                                Unique Selling Point (USP)
                                            </span>
                                        </label>
                                        <textarea
                                            value={data.usp}
                                            onChange={(e) =>
                                                setData('usp', e.target.value)
                                            }
                                            className="min-h-[80px] w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-white outline-none transition-all focus:ring-2 focus:ring-indigo-500"
                                            placeholder="What makes your product special?"
                                        />
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <label className="text-sm font-bold uppercase tracking-widest text-gray-400">
                                                Key Features
                                            </label>
                                            <button
                                                type="button"
                                                onClick={addFeature}
                                                className="flex items-center space-x-1 text-xs font-bold text-indigo-400 hover:text-indigo-300"
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
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 pr-12 text-white outline-none transition-all focus:ring-2 focus:ring-indigo-500"
                                                            required
                                                        />
                                                        {data.features.length >
                                                            1 && (
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    removeFeature(
                                                                        index,
                                                                    )
                                                                }
                                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 transition-colors hover:text-red-500"
                                                            >
                                                                <X className="h-4 w-4" />
                                                            </button>
                                                        )}
                                                    </div>
                                                ),
                                            )}
                                        </div>
                                    </div>

                                    <div className="pt-6">
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="flex w-full transform items-center justify-center space-x-3 rounded-2xl bg-indigo-600 px-10 py-5 font-bold text-white shadow-xl shadow-indigo-500/20 transition-all hover:bg-indigo-700 active:scale-[0.98] disabled:opacity-50 md:w-auto"
                                        >
                                            {processing ? (
                                                <div className="flex items-center space-x-3">
                                                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                                    <motion.span
                                                        key={loadingStep}
                                                        initial={{
                                                            opacity: 0,
                                                            y: 10,
                                                        }}
                                                        animate={{
                                                            opacity: 1,
                                                            y: 0,
                                                        }}
                                                        className="text-sm font-medium"
                                                    >
                                                        {
                                                            loadingMessages[
                                                                loadingStep
                                                            ]
                                                        }
                                                    </motion.span>
                                                </div>
                                            ) : (
                                                <>
                                                    <Sparkles className="h-5 w-5" />
                                                    <span>
                                                        Craft My Sales Page
                                                    </span>
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
                                className="rounded-[2.5rem] border border-white/10 bg-[#121217] p-8"
                            >
                                <div className="mb-8 flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <History className="h-5 w-5 text-gray-500" />
                                        <h3 className="text-xl font-bold text-white">
                                            History
                                        </h3>
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-600">
                                        {salesPages.length} Pages
                                    </span>
                                </div>

                                <div className="space-y-4">
                                    {salesPages.length === 0 ? (
                                        <div className="py-10 text-center">
                                            <p className="text-sm italic text-gray-600">
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
                                                    href={route(
                                                        'sales-pages.show',
                                                        page.uuid,
                                                    )}
                                                    className="block"
                                                >
                                                    <div className="rounded-2xl border border-white/5 bg-white/5 p-5 pr-12 transition-all group-hover:border-white/10 group-hover:bg-white/10">
                                                        <h4 className="mb-1 truncate font-bold text-white transition-colors group-hover:text-indigo-400">
                                                            {page.product_name}
                                                        </h4>
                                                        <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-gray-600">
                                                            <span>
                                                                {new Date(
                                                                    page.created_at,
                                                                ).toLocaleDateString()}
                                                            </span>
                                                            <span className="flex items-center space-x-1">
                                                                <Target className="h-3 w-3" />
                                                                <span>
                                                                    {
                                                                        page.views_count
                                                                    }{' '}
                                                                    Views
                                                                </span>
                                                            </span>
                                                        </div>
                                                    </div>
                                                </Link>
                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        setDeleteUuid(
                                                            page.uuid,
                                                        );
                                                    }}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-600 opacity-0 transition-all hover:text-red-500 group-hover:opacity-100"
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
        <div className="group flex items-center space-x-4 rounded-3xl border border-white/10 bg-[#121217] p-6 transition-all hover:border-indigo-500/30">
            <div className="rounded-2xl bg-white/5 p-3 transition-transform group-hover:scale-110">
                {icon}
            </div>
            <div>
                <div className="text-[10px] font-black uppercase tracking-widest text-gray-600">
                    {label}
                </div>
                <div className="text-2xl font-black text-white">{value}</div>
            </div>
        </div>
    );
}
