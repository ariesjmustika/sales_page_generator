import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Plus, Trash2, ArrowRight, History, Package, Target, DollarSign, Star, AlertTriangle, X, Zap } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Toaster, toast } from 'sonner';

interface SalesPage {
    id: number;
    uuid: string;
    product_name: string;
    created_at: string;
    status: string;
    views_count: number;
}

export default function Dashboard({ auth, salesPages }: PageProps<{ salesPages: SalesPage[] }>) {
    const [deleteUuid, setDeleteUuid] = useState<string | null>(null);
    const [loadingStep, setLoadingStep] = useState(0);
    const loadingMessages = [
        "Analyzing your product details...",
        "Crafting high-converting headlines...",
        "Structuring benefits using AIDA framework...",
        "Polishing your call-to-actions...",
        "Optimizing for maximum conversion...",
        "Finalizing your premium sales page..."
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
            header={<h2 className="font-bold text-2xl text-white leading-tight">MarketAI Dashboard</h2>}
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
                            className="relative bg-[#1a1a24] border border-white/10 rounded-[2rem] p-8 max-w-md w-full shadow-2xl"
                        >
                            <div className="flex items-center justify-center w-16 h-16 bg-red-500/10 rounded-2xl mb-6 mx-auto">
                                <AlertTriangle className="w-8 h-8 text-red-500" />
                            </div>
                            <h3 className="text-2xl font-bold text-white text-center mb-2">Delete Page?</h3>
                            <p className="text-gray-400 text-center mb-8">This action cannot be undone. All AI-generated content for this page will be lost forever.</p>
                            <div className="flex space-x-3">
                                <button 
                                    onClick={() => setDeleteUuid(null)}
                                    className="flex-1 px-6 py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-bold transition-all"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={handleDelete}
                                    className="flex-1 px-6 py-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-bold shadow-lg shadow-red-600/20 transition-all"
                                >
                                    Delete Now
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <div className="py-12 bg-[#0a0a0c] min-h-screen">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-8">
                    
                    {/* AI System Status */}
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col md:flex-row items-center justify-between p-6 bg-indigo-500/5 border border-indigo-500/10 rounded-[2rem] backdrop-blur-xl mb-4"
                    >
                        <div className="flex items-center space-x-4 mb-4 md:mb-0">
                            <div className="relative">
                                <div className="w-3 h-3 bg-green-500 rounded-full animate-ping absolute inset-0" />
                                <div className="w-3 h-3 bg-green-500 rounded-full relative" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-white tracking-tight">AI Multi-Model Engine: <span className="text-green-400">Operational</span></h4>
                                <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mt-1">Primary: Gemini 2.5 Flash • Secondary: Gemini 2.0 Flash</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2 bg-black/40 px-4 py-2 rounded-xl border border-white/5">
                            <Sparkles className="w-3 h-3 text-indigo-400" />
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Auto-Failover Discovery Active</span>
                        </div>
                    </motion.div>

                    {/* Stats Overview */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="grid grid-cols-1 md:grid-cols-4 gap-6"
                    >
                        <StatsCard 
                            icon={<Package className="w-5 h-5 text-indigo-400" />} 
                            label="Total Projects" 
                            value={salesPages.length} 
                        />
                        <StatsCard 
                            icon={<Target className="w-5 h-5 text-green-400" />} 
                            label="Total Views" 
                            value={salesPages.reduce((acc, p) => acc + (p.views_count || 0), 0)} 
                        />
                        <StatsCard 
                            icon={<Zap className="w-5 h-5 text-yellow-400" />} 
                            label="AI Generations" 
                            value={salesPages.length * 4} 
                        />
                        <StatsCard 
                            icon={<Star className="w-5 h-5 text-purple-400" />} 
                            label="Conversion Score" 
                            value="A+" 
                        />
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Form Section */}
                        <div className="lg:col-span-2">
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-[#121217] border border-white/10 overflow-hidden shadow-2xl rounded-[2.5rem] p-8 md:p-10"
                            >
                                <div className="flex items-center space-x-3 mb-10">
                                    <div className="p-3 bg-indigo-500/10 rounded-2xl"><Sparkles className="w-6 h-6 text-indigo-400" /></div>
                                    <div><h3 className="text-2xl font-bold text-white">Generate Sales Page</h3><p className="text-gray-500 text-sm">Let AI craft your high-converting copy</p></div>
                                </div>

                                <form onSubmit={submit} className="space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center space-x-2"><Package className="w-4 h-4" /><span>Product Name</span></label>
                                            <input type="text" value={data.product_name} onChange={(e) => setData('product_name', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:ring-2 focus:ring-indigo-500 transition-all outline-none" placeholder="e.g. SaaS Pro Max" required />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center space-x-2"><Target className="w-4 h-4" /><span>Target Audience</span></label>
                                            <input type="text" value={data.target_audience} onChange={(e) => setData('target_audience', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:ring-2 focus:ring-indigo-500 transition-all outline-none" placeholder="e.g. Freelance Designers" required />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-400 uppercase tracking-widest">Description</label>
                                        <textarea value={data.product_description} onChange={(e) => setData('product_description', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:ring-2 focus:ring-indigo-500 transition-all outline-none min-h-[120px]" placeholder="What does your product do?" required />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center space-x-2"><DollarSign className="w-4 h-4" /><span>Price</span></label>
                                            <input type="text" value={data.price} onChange={(e) => setData('price', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:ring-2 focus:ring-indigo-500 transition-all outline-none" placeholder="e.g. $49/month" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center space-x-2"><span>Tone</span></label>
                                            <select 
                                                value={data.tone} 
                                                onChange={(e) => setData('tone', e.target.value)}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:ring-2 focus:ring-indigo-500 transition-all outline-none appearance-none"
                                            >
                                                <option value="professional" className="bg-[#1a1a24]">Professional</option>
                                                <option value="persuasive" className="bg-[#1a1a24]">Persuasive</option>
                                                <option value="witty" className="bg-[#1a1a24]">Witty & Fun</option>
                                                <option value="urgent" className="bg-[#1a1a24]">Urgent/Scarcity</option>
                                                <option value="friendly" className="bg-[#1a1a24]">Friendly</option>
                                                <option value="minimalist" className="bg-[#1a1a24]">Minimalist</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center space-x-2"><Star className="w-4 h-4" /><span>Unique Selling Point (USP)</span></label>
                                        <textarea value={data.usp} onChange={(e) => setData('usp', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:ring-2 focus:ring-indigo-500 transition-all outline-none min-h-[80px]" placeholder="What makes your product special?" />
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between"><label className="text-sm font-bold text-gray-400 uppercase tracking-widest">Key Features</label><button type="button" onClick={addFeature} className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center space-x-1"><Plus className="w-3 h-3" /><span>Add New</span></button></div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {data.features.map((feature, index) => (
                                                <div key={index} className="relative group">
                                                    <input type="text" value={feature} onChange={(e) => handleFeatureChange(index, e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:ring-2 focus:ring-indigo-500 transition-all outline-none pr-12" required />
                                                    {data.features.length > 1 && (<button type="button" onClick={() => removeFeature(index)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-red-500 transition-colors"><X className="w-4 h-4" /></button>)}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="pt-6">
                                        <button type="submit" disabled={processing} className="w-full md:w-auto px-10 py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold flex items-center justify-center space-x-3 transition-all transform active:scale-[0.98] shadow-xl shadow-indigo-500/20 disabled:opacity-50">
                                            {processing ? (
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
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
                                                <><Sparkles className="w-5 h-5" /><span>Craft My Sales Page</span></>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        </div>

                        {/* History Section */}
                        <div className="lg:col-span-1">
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-[#121217] border border-white/10 rounded-[2.5rem] p-8">
                                <div className="flex items-center justify-between mb-8">
                                    <div className="flex items-center space-x-3"><History className="w-5 h-5 text-gray-500" /><h3 className="text-xl font-bold text-white">History</h3></div>
                                    <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">{salesPages.length} Pages</span>
                                </div>

                                <div className="space-y-4">
                                    {salesPages.length === 0 ? (<div className="text-center py-10"><p className="text-gray-600 text-sm italic">No pages generated yet.</p></div>) : (
                                        salesPages.map((page) => (
                                            <div key={page.id} className="relative group">
                                                <Link href={route('sales-pages.show', page.uuid)} className="block">
                                                    <div className="p-5 bg-white/5 border border-white/5 rounded-2xl group-hover:bg-white/10 group-hover:border-white/10 transition-all pr-12">
                                                        <h4 className="font-bold text-white group-hover:text-indigo-400 transition-colors truncate mb-1">{page.product_name}</h4>
                                                        <div className="flex items-center justify-between text-[10px] uppercase tracking-widest font-black text-gray-600">
                                                            <span>{new Date(page.created_at).toLocaleDateString()}</span>
                                                            <span className="flex items-center space-x-1"><Target className="w-3 h-3" /><span>{page.views_count} Views</span></span>
                                                        </div>
                                                    </div>
                                                </Link>
                                                <button 
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        setDeleteUuid(page.uuid);
                                                    }}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 opacity-0 group-hover:opacity-100 text-gray-600 hover:text-red-500 transition-all"
                                                >
                                                    <Trash2 className="w-4 h-4" />
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

function StatsCard({ icon, label, value }: { icon: React.ReactNode, label: string, value: string | number }) {
    return (
        <div className="bg-[#121217] border border-white/10 rounded-3xl p-6 flex items-center space-x-4 hover:border-indigo-500/30 transition-all group">
            <div className="p-3 bg-white/5 rounded-2xl group-hover:scale-110 transition-transform">
                {icon}
            </div>
            <div>
                <div className="text-[10px] font-black text-gray-600 uppercase tracking-widest">{label}</div>
                <div className="text-2xl font-black text-white">{value}</div>
            </div>
        </div>
    );
}
