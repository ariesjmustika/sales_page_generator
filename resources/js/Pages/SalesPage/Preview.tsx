import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Download, Copy, ExternalLink, CheckCircle2, Globe, Layout, Palette, RefreshCw, Save, Edit3, Zap, Crown, Image as ImageIcon, Trash2, AlertTriangle, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast, Toaster } from 'sonner';

interface Props {
    salesPage: {
        id: number;
        product_name: string;
        generated_copy: {
            headline: string;
            subheadline: string;
            problem: string;
            solution: string;
            benefits: string[];
            features_breakdown: Array<{title: string, description: string}>;
            social_proof_placeholder: string;
            pricing_display: string;
            cta: string;
            image_keyword?: string;
        };
        theme: string;
        created_at: string;
    };
}

export default function Preview({ salesPage }: Props) {
    const [copy, setCopy] = useState(salesPage.generated_copy);
    const [activeTab, setActiveTab] = useState<'preview' | 'content'>('preview');
    const [isRegenerating, setIsRegenerating] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    // Truly Dynamic AI-Driven Image Generation (Direct AI)
    const magicPrompt = `${salesPage.product_name} ${copy.image_keyword || ''}`.slice(0, 50);
    const heroImage = `https://image.pollinations.ai/prompt/${encodeURIComponent(magicPrompt)}?width=1200&height=800&nologo=true&seed=${salesPage.id}`;

    // Smart Fallback Logic: Ultra-Reliable Static IDs from Unsplash CDN
    const getFallbackImage = () => {
        const text = (salesPage.product_name + ' ' + (copy.image_keyword || '')).toLowerCase();
        // Coffee Niche
        if (text.includes('coffee') || text.includes('brew') || text.includes('cafe')) return 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80';
        // Tech / AI Niche
        if (text.includes('tech') || text.includes('ai') || text.includes('software') || text.includes('security')) return 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80';
        // Gaming / Chair Niche
        if (text.includes('chair') || text.includes('gaming') || text.includes('furniture')) return 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&w=1200&q=80';
        // Fashion / Sneakers Niche
        if (text.includes('sneaker') || text.includes('shoes') || text.includes('fashion') || text.includes('urban')) return 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80';
        // Gadget / Mirror / Beauty Niche
        if (text.includes('mirror') || text.includes('gadget') || text.includes('beauty') || text.includes('influencer')) return 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80';
        
        return `https://picsum.photos/seed/${salesPage.id}/1200/800`;
    };

    useEffect(() => {
        setCopy(salesPage.generated_copy);
    }, [salesPage.generated_copy]);

    const handleUpdateContent = (key: string, value: string | string[]) => {
        const newCopy = { ...copy, [key]: value };
        setCopy(newCopy);
        saveManualEdit(newCopy);
    };

    const saveManualEdit = (updatedCopy: any) => {
        setIsSaving(true);
        router.post(route('sales-pages.update-copy', salesPage.id), {
            generated_copy: updatedCopy
        }, {
            preserveScroll: true,
            onSuccess: () => setIsSaving(false),
            onFinish: () => setIsSaving(false),
        });
    };

    const handleRegenerate = (section: string) => {
        setIsRegenerating(section);
        router.post(route('sales-pages.regenerate', salesPage.id), {
            section: section
        }, {
            onSuccess: () => {
                toast.success(`${section} regenerated!`);
                setIsRegenerating(null);
            },
            onError: () => setIsRegenerating(null),
        });
    };

    const handleUpdateTheme = (theme: string) => {
        router.post(route('sales-pages.update-theme', salesPage.id), {
            theme: theme
        }, {
            preserveScroll: true,
            onSuccess: () => toast.success(`Theme switched to ${theme}!`),
        });
    };

    const handleDelete = () => {
        router.delete(route('sales-pages.destroy', salesPage.id), {
            onFinish: () => {
                setShowDeleteModal(false);
            }
        });
    };

    const downloadHtml = () => {
        const t = salesPage.theme;
        const isVibrant = t === 'vibrant';
        const isCorporate = t === 'corporate';
        const isDarkTech = t === 'dark_tech';
        const isMinimal = t === 'minimalist';
        
        const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${salesPage.product_name} - Sales Page</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&family=Playfair+Display:wght@700&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Inter', sans-serif; }
        .font-serif { font-family: 'Playfair Display', serif; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
        .vibrant-gradient { background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%); }
    </style>
</head>
<body class="${isCorporate || isMinimal ? 'bg-white text-slate-900' : isDarkTech ? 'bg-black text-green-400' : isVibrant ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}">
    <header class="py-24 px-6 max-w-6xl mx-auto flex flex-col items-center text-center">
        <h1 class="text-5xl md:text-7xl font-extrabold mb-10 tracking-tight ${isCorporate || isMinimal ? 'font-serif text-slate-900' : isDarkTech ? 'font-mono uppercase italic' : isVibrant ? 'bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-fuchsia-400' : ''}">${copy.headline}</h1>
        <p class="text-xl md:text-2xl mb-12 max-w-3xl mx-auto ${isCorporate || isMinimal ? 'text-slate-500 italic' : isDarkTech ? 'font-mono text-green-800' : 'text-slate-400'}">${copy.subheadline}</p>
        <div class="w-full mb-16 rounded-[2.5rem] overflow-hidden shadow-2xl border-8 ${isCorporate ? 'border-blue-50' : isDarkTech ? 'border-green-500/20 shadow-green-500/10' : 'border-white/5'}">
            <img src="${heroImage}" alt="Hero" class="w-full h-[500px] object-cover ${isDarkTech ? 'grayscale invert brightness-50 contrast-150' : ''}" />
        </div>
        <button class="px-12 py-5 rounded-full text-lg font-bold transition-all transform hover:scale-105 shadow-2xl ${isCorporate ? 'bg-blue-800 text-white' : isMinimal ? 'bg-slate-900 text-white tracking-widest' : isDarkTech ? 'bg-green-500 text-black' : isVibrant ? 'vibrant-gradient text-white' : 'bg-indigo-600 text-white'}">
            ${copy.cta}
        </button>
    </header>
    <section class="py-32 ${isCorporate || isMinimal ? 'bg-slate-50' : isDarkTech ? 'bg-white/5 border-y border-green-500/20' : 'bg-white/5'}">
        <div class="max-w-5xl mx-auto px-6 grid md:grid-cols-2 gap-20">
            <div><h3 class="text-sm font-black uppercase tracking-[0.2em] mb-8 ${isDarkTech ? 'text-green-500' : 'text-red-500'}">The Problem</h3><p class="text-2xl leading-relaxed">${copy.problem}</p></div>
            <div><h3 class="text-sm font-black uppercase tracking-[0.2em] mb-8 ${isDarkTech ? 'text-green-300' : 'text-green-500'}">The Solution</h3><p class="text-2xl leading-relaxed">${copy.solution}</p></div>
        </div>
    </section>
    <section class="py-32 px-6">
        <div class="max-w-4xl mx-auto rounded-[4rem] p-20 text-center ${isMinimal ? 'bg-slate-900 text-white' : isCorporate ? 'bg-blue-950 text-white' : isDarkTech ? 'bg-black border-2 border-green-500 text-green-500' : 'bg-indigo-900 text-white'}">
            <div class="text-8xl font-black mb-12 tracking-tighter">${copy.pricing_display}</div>
            <button class="px-16 py-6 rounded-full text-2xl font-bold bg-white ${isDarkTech ? 'text-black' : 'text-slate-900'}">${copy.cta}</button>
        </div>
    </section>
</body>
</html>
        `;
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url;
        a.download = `${salesPage.product_name.toLowerCase().replace(/\s+/g, '-')}-sales-page.html`;
        document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
        toast.success('Site Exported!');
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Link href={route('dashboard')} className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400"><ArrowLeft className="w-5 h-5" /></Link>
                        <div>
                            <h2 className="text-xl font-bold text-white leading-tight">{salesPage.product_name}</h2>
                            <div className="flex items-center space-x-2">
                                <p className="text-xs text-gray-500">Draft saved {new Date(salesPage.created_at).toLocaleDateString()}</p>
                                {isSaving && <span className="flex items-center space-x-1 text-[10px] text-indigo-400 animate-pulse"><Save className="w-3 h-3" /><span>Saving...</span></span>}
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <button 
                            onClick={() => setShowDeleteModal(true)}
                            className="p-2.5 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                            title="Delete Page"
                        >
                            <Trash2 className="w-5 h-5" />
                        </button>
                        <button onClick={downloadHtml} className="flex items-center space-x-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold transition-all shadow-lg"><Download className="w-4 h-4" /><span>Export Site</span></button>
                    </div>
                </div>
            }
        >
            <Head title={`Editor: ${salesPage.product_name}`} />
            <Toaster position="top-right" theme="dark" />

            {/* Custom Delete Modal */}
            <AnimatePresence>
                {showDeleteModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowDeleteModal(false)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
                        <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="relative bg-[#1a1a24] border border-white/10 rounded-[2rem] p-8 max-w-md w-full shadow-2xl">
                            <div className="flex items-center justify-center w-16 h-16 bg-red-500/10 rounded-2xl mb-6 mx-auto"><AlertTriangle className="w-8 h-8 text-red-500" /></div>
                            <h3 className="text-2xl font-bold text-white text-center mb-2">Delete Page?</h3>
                            <p className="text-gray-400 text-center mb-8">This action cannot be undone. All AI-generated content for this page will be lost forever.</p>
                            <div className="flex space-x-3">
                                <button onClick={() => setShowDeleteModal(false)} className="flex-1 px-6 py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-bold transition-all">Cancel</button>
                                <button onClick={handleDelete} className="flex-1 px-6 py-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-bold shadow-lg shadow-red-600/20 transition-all">Delete Now</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <div className="py-8 bg-[#0a0a0c] min-h-screen">
                <div className="mx-auto max-[1600px] sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                        {/* Control Panel */}
                        <div className="lg:col-span-1 space-y-6">
                            <div className="bg-[#121217] border border-white/10 rounded-3xl p-6 sticky top-24">
                                <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-6">Interface</h3>
                                <div className="space-y-2">
                                    <button onClick={() => setActiveTab('preview')} className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-2xl transition-all ${activeTab === 'preview' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-inner' : 'text-gray-500 hover:bg-white/5'}`}><Layout className="w-5 h-5" /><span className="font-bold text-sm">Visual Editor</span></button>
                                    <button onClick={() => setActiveTab('content')} className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-2xl transition-all ${activeTab === 'content' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-inner' : 'text-gray-500 hover:bg-white/5'}`}><Globe className="w-5 h-5" /><span className="font-bold text-sm">Raw Data</span></button>
                                </div>
                                <div className="mt-8 pt-8 border-t border-white/5">
                                    <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-6">Templates</h3>
                                    <div className="grid grid-cols-1 gap-2">
                                        {[
                                            { id: 'modern', name: 'Modern SaaS', icon: <Zap className="w-4 h-4" /> },
                                            { id: 'corporate', name: 'Corporate Pro', icon: <Globe className="w-4 h-4" /> },
                                            { id: 'vibrant', name: 'Vibrant Pulse', icon: <Palette className="w-4 h-4" /> },
                                            { id: 'dark_tech', name: 'Dark Tech', icon: <ImageIcon className="w-4 h-4" /> },
                                            { id: 'minimalist', name: 'Minimal Luxury', icon: <Crown className="w-4 h-4" /> },
                                        ].map((t) => (
                                            <button key={t.id} onClick={() => handleUpdateTheme(t.id)} className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl border transition-all ${salesPage.theme === t.id ? 'bg-white/10 border-indigo-500/50 text-white' : 'bg-white/5 border-transparent text-gray-500 hover:bg-white/10'}`}><div className="flex items-center space-x-3"><span className={`${salesPage.theme === t.id ? 'text-indigo-400' : 'text-gray-600'}`}>{t.icon}</span><span className="text-xs font-bold">{t.name}</span></div>{salesPage.theme === t.id && <div className="w-2 h-2 rounded-full bg-indigo-400" />}</button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Visual Canvas */}
                        <div className="lg:col-span-4">
                            <AnimatePresence mode="wait">
                                {activeTab === 'preview' ? (
                                    <motion.div key="preview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="bg-white rounded-[3rem] overflow-hidden shadow-2xl border border-white/5">
                                        <div className="bg-gray-100 px-8 py-5 border-b border-gray-200 flex items-center space-x-6"><div className="flex space-x-2"><div className="w-3.5 h-3.5 bg-red-400 rounded-full" /><div className="w-3.5 h-3.5 bg-yellow-400 rounded-full" /><div className="w-3.5 h-3.5 bg-green-400 rounded-full" /></div><div className="bg-white px-5 py-2 rounded-xl text-[12px] text-gray-400 flex-1 flex items-center justify-between border border-gray-200"><span className="flex items-center space-x-2 font-medium tracking-tight"><Globe className="w-4 h-4 opacity-30" /><span>marketai.local/v/${salesPage.id}/${salesPage.product_name.toLowerCase().replace(/\s+/g, '-')}</span></span></div></div>
                                        <div className={`overflow-y-auto max-h-[1200px] custom-scrollbar transition-all duration-1000 ${salesPage.theme === 'corporate' || salesPage.theme === 'minimalist' ? 'bg-white text-slate-900' : salesPage.theme === 'dark_tech' ? 'bg-black text-green-400 font-mono' : salesPage.theme === 'vibrant' ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
                                            <div className="max-w-5xl mx-auto text-center space-y-16 p-24">
                                                <div className="group relative">
                                                    <h1 contentEditable suppressContentEditableWarning onBlur={(e) => handleUpdateContent('headline', e.currentTarget.innerText)} className={`outline-none px-4 rounded-2xl hover:bg-indigo-500/5 transition-all cursor-text leading-[1.1] ${salesPage.theme === 'corporate' || salesPage.theme === 'minimalist' ? 'text-6xl font-serif text-slate-900' : salesPage.theme === 'dark_tech' ? 'text-6xl font-bold uppercase italic' : salesPage.theme === 'vibrant' ? 'text-7xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-indigo-400' : 'text-7xl font-black text-slate-900'}`}>{copy.headline}</h1>
                                                    <button onClick={() => handleRegenerate('headline')} className="absolute -right-12 top-0 p-3 opacity-0 group-hover:opacity-100 text-indigo-500 hover:bg-indigo-500/10 rounded-full transition-all"><RefreshCw className={`w-5 h-5 ${isRegenerating === 'headline' ? 'animate-spin' : ''}`} /></button>
                                                </div>
                                                <div className="group relative">
                                                    <p contentEditable suppressContentEditableWarning onBlur={(e) => handleUpdateContent('subheadline', e.currentTarget.innerText)} className={`outline-none px-4 rounded-2xl text-2xl max-w-3xl mx-auto transition-all cursor-text leading-relaxed ${salesPage.theme === 'corporate' || salesPage.theme === 'minimalist' ? 'text-slate-500 italic' : salesPage.theme === 'dark_tech' ? 'text-green-800' : 'text-slate-400'}`}>{copy.subheadline}</p>
                                                    <button onClick={() => handleRegenerate('subheadline')} className="absolute -right-12 top-0 p-3 opacity-0 group-hover:opacity-100 text-indigo-500 hover:bg-indigo-500/10 rounded-full transition-all"><RefreshCw className={`w-5 h-5 ${isRegenerating === 'subheadline' ? 'animate-spin' : ''}`} /></button>
                                                </div>
                                                <div className="group relative w-full aspect-video rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white/10 transform transition-all hover:scale-[1.01] bg-white/5 backdrop-blur-sm">
                                            <img 
                                                src={heroImage} 
                                                alt="Magic Hero" 
                                                referrerPolicy="no-referrer"
                                                onError={(e) => {
                                                    e.currentTarget.onerror = null;
                                                    e.currentTarget.src = getFallbackImage();
                                                }}
                                                className={`w-full h-full object-cover transition-all duration-1000 ${salesPage.theme === 'dark_tech' ? 'grayscale invert brightness-50 contrast-150' : ''}`} 
                                            />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
                                                    <div className="absolute top-6 right-6 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full flex items-center space-x-2 border border-white/30 text-white shadow-xl"><ImageIcon className="w-4 h-4" /><span className="text-[10px] font-black uppercase tracking-widest">AI Generated Scene</span></div>
                                                </div>
                                                <div className="group relative">
                                                    <button contentEditable suppressContentEditableWarning onBlur={(e) => handleUpdateContent('cta', e.currentTarget.innerText)} className={`outline-none px-12 py-6 rounded-full font-black text-xl shadow-2xl transition-all transform hover:scale-110 active:scale-95 ${salesPage.theme === 'corporate' ? 'bg-blue-900 text-white' : salesPage.theme === 'minimalist' ? 'bg-slate-900 text-white' : salesPage.theme === 'dark_tech' ? 'bg-green-500 text-black border-2 border-black' : salesPage.theme === 'vibrant' ? 'bg-gradient-to-r from-indigo-500 via-purple-600 to-fuchsia-600 text-white shadow-fuchsia-500/20' : 'bg-indigo-600 text-white'}`}>{copy.cta}</button>
                                                    <button onClick={() => handleRegenerate('cta')} className="absolute -right-12 top-1/2 -translate-y-1/2 p-3 opacity-0 group-hover:opacity-100 text-indigo-500 hover:bg-indigo-500/10 rounded-full transition-all"><RefreshCw className={`w-5 h-5 ${isRegenerating === 'cta' ? 'animate-spin' : ''}`} /></button>
                                                </div>
                                                <div className={`grid grid-cols-2 gap-20 text-left pt-24 border-t ${salesPage.theme === 'corporate' || salesPage.theme === 'minimalist' ? 'border-slate-100' : salesPage.theme === 'dark_tech' ? 'border-green-500/20' : 'border-white/10'}`}>
                                                    <div className="group relative">
                                                        <h4 className={`text-[11px] font-black uppercase tracking-[0.3em] mb-6 ${salesPage.theme === 'dark_tech' ? 'text-green-500' : 'text-red-500'}`}>The Pain Point</h4>
                                                        <p contentEditable suppressContentEditableWarning onBlur={(e) => handleUpdateContent('problem', e.currentTarget.innerText)} className="outline-none text-2xl leading-relaxed cursor-text">{copy.problem}</p>
                                                        <button onClick={() => handleRegenerate('problem')} className="absolute -right-10 top-0 p-3 opacity-0 group-hover:opacity-100 text-indigo-500 hover:bg-indigo-500/10 rounded-full transition-all"><RefreshCw className={`w-4 h-4 ${isRegenerating === 'problem' ? 'animate-spin' : ''}`} /></button>
                                                    </div>
                                                    <div className="group relative">
                                                        <h4 className={`text-[11px] font-black uppercase tracking-[0.3em] mb-6 ${salesPage.theme === 'dark_tech' ? 'text-green-300' : 'text-green-500'}`}>The Solution</h4>
                                                        <p contentEditable suppressContentEditableWarning onBlur={(e) => handleUpdateContent('solution', e.currentTarget.innerText)} className="outline-none text-2xl leading-relaxed cursor-text">{copy.solution}</p>
                                                        <button onClick={() => handleRegenerate('solution')} className="absolute -right-10 top-0 p-3 opacity-0 group-hover:opacity-100 text-indigo-500 hover:bg-indigo-500/10 rounded-full transition-all"><RefreshCw className={`w-4 h-4 ${isRegenerating === 'solution' ? 'animate-spin' : ''}`} /></button>
                                                    </div>
                                                </div>
                                                <div className="pt-24 pb-16">
                                                    <div className={`rounded-[4rem] p-24 shadow-2xl relative overflow-hidden group transition-all ${salesPage.theme === 'minimalist' ? 'bg-slate-900 text-white' : salesPage.theme === 'corporate' ? 'bg-blue-950 text-white' : salesPage.theme === 'dark_tech' ? 'bg-black border-4 border-green-500 text-green-500' : 'bg-indigo-950 text-white shadow-indigo-500/10'}`}>
                                                        <h2 className="text-4xl font-bold mb-10">Start Your Journey</h2>
                                                        <div contentEditable suppressContentEditableWarning onBlur={(e) => handleUpdateContent('pricing_display', e.currentTarget.innerText)} className="text-9xl font-black mb-12 tracking-tighter outline-none cursor-text">{copy.pricing_display}</div>
                                                        <p contentEditable suppressContentEditableWarning onBlur={(e) => handleUpdateContent('social_proof_placeholder', e.currentTarget.innerText)} className="text-xl opacity-60 mb-16 max-w-lg mx-auto outline-none cursor-text leading-relaxed">{copy.social_proof_placeholder}</p>
                                                        <button className={`px-16 py-7 rounded-full font-black text-2xl transition-all transform hover:scale-110 active:scale-95 bg-white ${salesPage.theme === 'dark_tech' ? 'text-black' : 'text-indigo-900'}`}>{copy.cta}</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div key="content" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="bg-[#121217] border border-white/10 rounded-[2.5rem] p-10">
                                        <div className="flex justify-between items-center mb-10 pb-6 border-b border-white/5"><h3 className="text-2xl font-bold text-white">Data Structure</h3><button onClick={() => { navigator.clipboard.writeText(JSON.stringify(copy, null, 2)); toast.success('JSON Copied!'); }} className="text-indigo-400 font-bold text-xs">COPY JSON</button></div>
                                        <div className="space-y-10 text-gray-400">
                                            {Object.entries(copy).map(([key, value]) => (
                                                <div key={key} className="space-y-2"><label className="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em]">{key}</label><div className="p-6 bg-white/[0.02] rounded-2xl italic">{Array.isArray(value) ? value.join(', ') : value}</div></div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
            <style dangerouslySetInnerHTML={{ __html: `.custom-scrollbar::-webkit-scrollbar { width: 8px; } .custom-scrollbar::-webkit-scrollbar-track { background: transparent; } .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.05); border-radius: 20px; }`}} />
        </AuthenticatedLayout>
    );
}
