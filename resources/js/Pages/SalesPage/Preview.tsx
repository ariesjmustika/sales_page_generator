import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Download, Copy, ExternalLink, CheckCircle2, Globe, Layout, Palette, RefreshCw, Save, Edit3, Zap, Crown, Image as ImageIcon, Trash2, AlertTriangle, X, FileText, HelpCircle, MessageSquare, Smartphone } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast, Toaster } from 'sonner';
import axios from 'axios';

interface Props {
    salesPage: {
        id: number;
        uuid: string;
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
        image_style: string;
        image_seed: number;
        created_at: string;
    };
}

export default function Preview({ salesPage }: Props) {
    const [copy, setCopy] = useState(salesPage.generated_copy);
    const [activeTab, setActiveTab] = useState<'preview' | 'content'>('preview');
    const [viewport, setViewport] = useState<'desktop' | 'mobile'>('desktop');
    const [isRegenerating, setIsRegenerating] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    // AI Image Refiner Logic
    const magicPrompt = `${salesPage.product_name} ${salesPage.image_style} ${copy.image_keyword || ''}`.slice(0, 100);
    const heroImage = `https://image.pollinations.ai/prompt/${encodeURIComponent(magicPrompt)}?width=1200&height=800&nologo=true&seed=${salesPage.image_seed}`;

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

    const handleUpdateImageStyle = (style: string) => {
        router.post(route('sales-pages.image-style', salesPage.id), {
            image_style: style
        }, {
            preserveScroll: true,
            onSuccess: () => toast.success(`Image style set to ${style}!`),
        });
    };

    const handleRegenerateImage = () => {
        router.post(route('sales-pages.regenerate-image', salesPage.id), {}, {
            preserveScroll: true,
            onSuccess: () => toast.success('New image generated!'),
        });
    };

    const handleDelete = () => {
        router.delete(route('sales-pages.destroy', salesPage.id), {
            onFinish: () => {
                setShowDeleteModal(false);
            }
        });
    };

    // Magic Toolbar State
    const [toolbarPos, setToolbarPos] = useState<{ top: number, left: number } | null>(null);
    const [selectedSection, setSelectedSection] = useState<string | null>(null);
    const [selectedText, setSelectedText] = useState("");
    const [isMagicLoading, setIsMagicLoading] = useState(false);
    const [imageFilters, setImageFilters] = useState({
        grayscale: false,
        invert: false,
        sepia: false,
        blur: 0
    });

    const handleImageFilter = (filter: string) => {
        const currentFilters = salesPage.settings?.image_filters || { grayscale: false, invert: false, sepia: false };
        const newFilters = { ...currentFilters, [filter]: !currentFilters[filter as keyof typeof currentFilters] };
        
        const newSettings = { ...salesPage.settings, image_filters: newFilters };
        router.post(route('sales-pages.update-settings', salesPage.id), { settings: newSettings }, { preserveScroll: true });
        toast.success(`Image filter updated!`);
    };

    const handleTextClick = (e: React.MouseEvent, section: string) => {
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        setToolbarPos({
            top: rect.top + window.scrollY - 60,
            left: rect.left + rect.width / 2
        });
        setSelectedSection(section);
        setSelectedText((e.currentTarget as HTMLElement).innerText);
    };

    const handleMagicRewrite = (action: string) => {
        if (!selectedSection || !selectedText) return;
        
        setIsMagicLoading(true);
        router.post(route('sales-pages.magic-rewrite', salesPage.id), {
            text: selectedText,
            action: action,
            section: selectedSection
        }, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: (page) => {
                // @ts-ignore
                const newCopy = page.props.salesPage.generated_copy;
                setCopy(newCopy);
                
                // Manually force DOM update for contentEditable to avoid React's update-bailout
                if (selectedSection) {
                    const el = document.querySelector(`[data-section="${selectedSection}"]`);
                    if (el) (el as HTMLElement).innerHTML = newCopy[selectedSection];
                }

                toast.success(`Text updated to ${action} version!`);
                setToolbarPos(null);
            },
            onFinish: () => {
                setIsMagicLoading(false);
                setSelectedSection(null);
            },
        });
    };

    const handleBlur = (section: string, html: string) => {
        // Only block auto-save if AI is actually processing to prevent race conditions
        if (isMagicLoading) return; 
        handleUpdateContent(section, html);
    };

    // Conversion States (Local for Debounce)
    const [waNumber, setWaNumber] = useState(salesPage.settings?.whatsapp_number || '');
    const [waMessage, setWaMessage] = useState(salesPage.settings?.whatsapp_message || '');

    useEffect(() => {
        const timer = setTimeout(() => {
            if (waNumber !== (salesPage.settings?.whatsapp_number || '') || 
                waMessage !== (salesPage.settings?.whatsapp_message || '')) {
                const newSettings = { 
                    ...salesPage.settings, 
                    whatsapp_number: waNumber, 
                    whatsapp_message: waMessage 
                };
                router.post(route('sales-pages.update-settings', salesPage.id), { settings: newSettings }, { 
                    preserveScroll: true,
                    preserveState: true,
                });
            }
        }, 800);

        return () => clearTimeout(timer);
    }, [waNumber, waMessage]);

    const formatText = (command: string) => {
        document.execCommand(command, false, undefined);
        // Trigger save after formatting
        if (selectedSection) {
            const el = document.querySelector(`[data-section="${selectedSection}"]`);
            if (el) handleUpdateContent(selectedSection, (el as HTMLElement).innerText);
        }
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
                        <button 
                            onClick={() => {
                                const url = `${window.location.origin}/s/${salesPage.uuid}`;
                                navigator.clipboard.writeText(url);
                                toast.success('Public link copied!');
                            }}
                            className="flex items-center space-x-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl text-sm font-bold transition-all shadow-lg"
                        >
                            <Copy className="w-4 h-4" />
                            <span>Share Link</span>
                        </button>
                        <button 
                            onClick={() => window.print()}
                            className="flex items-center space-x-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl text-sm font-bold transition-all shadow-lg"
                        >
                            <FileText className="w-4 h-4" />
                            <span>PDF</span>
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

            {/* Floating Magic Toolbar */}
            <AnimatePresence>
                {toolbarPos && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        style={{ 
                            position: 'absolute', 
                            top: toolbarPos.top, 
                            left: toolbarPos.left, 
                            transform: 'translateX(-50%)' 
                        }}
                        className="z-[100] flex items-center bg-[#1a1a24]/90 backdrop-blur-xl border border-white/10 p-1.5 rounded-2xl shadow-2xl space-x-1"
                    >
                        <div className="flex items-center border-r border-white/5 pr-1 mr-1">
                            <button onMouseDown={(e) => e.preventDefault()} onClick={() => formatText('bold')} className="p-2 hover:bg-white/10 text-gray-300 rounded-xl transition-all" title="Bold"><span className="font-bold">B</span></button>
                            <button onMouseDown={(e) => e.preventDefault()} onClick={() => formatText('italic')} className="p-2 hover:bg-white/10 text-gray-300 rounded-xl transition-all" title="Italic"><span className="italic">I</span></button>
                        </div>
                        
                        <div className="flex items-center space-x-1">
                            <button 
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={() => handleMagicRewrite('shorten')} 
                                disabled={isMagicLoading}
                                className="px-3 py-2 hover:bg-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all disabled:opacity-50"
                            >
                                {isMagicLoading ? '...' : 'Shorten'}
                            </button>
                            <button 
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={() => handleMagicRewrite('persuasive')} 
                                disabled={isMagicLoading}
                                className="px-3 py-2 hover:bg-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all disabled:opacity-50"
                            >
                                Persuasive
                            </button>
                            <button 
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={() => handleMagicRewrite('witty')} 
                                disabled={isMagicLoading}
                                className="px-3 py-2 hover:bg-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all disabled:opacity-50"
                            >
                                Witty
                            </button>
                            <button 
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={() => handleMagicRewrite('professional')} 
                                disabled={isMagicLoading}
                                className="px-3 py-2 hover:bg-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all disabled:opacity-50"
                            >
                                Pro
                            </button>
                        </div>
                        <button onClick={() => setToolbarPos(null)} className="p-2 hover:bg-red-500/10 text-gray-500 hover:text-red-400 rounded-xl transition-all"><X className="w-4 h-4" /></button>
                    </motion.div>
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
                                    <button onClick={() => setActiveTab('conversion')} className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-2xl transition-all ${activeTab === 'conversion' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-inner' : 'text-gray-500 hover:bg-white/5'}`}><Zap className="w-5 h-5" /><span className="font-bold text-sm">Conversion</span></button>
                                    <button onClick={() => setActiveTab('content')} className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-2xl transition-all ${activeTab === 'content' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-inner' : 'text-gray-500 hover:bg-white/5'}`}><Globe className="w-5 h-5" /><span className="font-bold text-sm">Raw Data</span></button>
                                </div>
                                
                                {activeTab === 'preview' && (
                                    <div className="mt-8 pt-8 border-t border-white/5">
                                        <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-6">Viewport</h3>
                                        <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10">
                                            <button 
                                                onClick={() => setViewport('desktop')}
                                                className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-xl transition-all ${viewport === 'desktop' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
                                            >
                                                <Layout className="w-4 h-4" />
                                                <span className="text-xs font-bold">Desktop</span>
                                            </button>
                                            <button 
                                                onClick={() => setViewport('mobile')}
                                                className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-xl transition-all ${viewport === 'mobile' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
                                            >
                                                <Smartphone className="w-4 h-4" />
                                                <span className="text-xs font-bold">Mobile</span>
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'preview' && (
                                    <div className="mt-8 pt-8 border-t border-white/5">
                                        <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-6">Page Sections</h3>
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-2xl group hover:border-indigo-500/30 transition-all">
                                                <div className="flex items-center space-x-3">
                                                    <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400"><HelpCircle className="w-4 h-4" /></div>
                                                    <span className="text-sm font-bold text-gray-300">FAQ Section</span>
                                                </div>
                                                <button 
                                                    onClick={() => {
                                                        const visible = salesPage.settings?.visible_sections || {};
                                                        const newSettings = { 
                                                            ...salesPage.settings, 
                                                            visible_sections: { ...visible, faq: !visible.faq } 
                                                        };
                                                        router.post(route('sales-pages.update-settings', salesPage.id), { settings: newSettings }, { preserveScroll: true });
                                                    }}
                                                    className={`w-12 h-6 rounded-full transition-all relative ${salesPage.settings?.visible_sections?.faq ? 'bg-indigo-600' : 'bg-white/10'}`}
                                                >
                                                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${salesPage.settings?.visible_sections?.faq ? 'left-7' : 'left-1'}`} />
                                                </button>
                                            </div>

                                            <div className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-2xl group hover:border-indigo-500/30 transition-all">
                                                <div className="flex items-center space-x-3">
                                                    <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400"><MessageSquare className="w-4 h-4" /></div>
                                                    <span className="text-sm font-bold text-gray-300">Testimonials</span>
                                                </div>
                                                <button 
                                                    onClick={() => {
                                                        const visible = salesPage.settings?.visible_sections || {};
                                                        const newSettings = { 
                                                            ...salesPage.settings, 
                                                            visible_sections: { ...visible, testimonials: !visible.testimonials } 
                                                        };
                                                        router.post(route('sales-pages.update-settings', salesPage.id), { settings: newSettings }, { preserveScroll: true });
                                                    }}
                                                    className={`w-12 h-6 rounded-full transition-all relative ${salesPage.settings?.visible_sections?.testimonials ? 'bg-purple-600' : 'bg-white/10'}`}
                                                >
                                                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${salesPage.settings?.visible_sections?.testimonials ? 'left-7' : 'left-1'}`} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

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
                                    <motion.div 
                                        key="preview" 
                                        initial={{ opacity: 0, y: 10 }} 
                                        animate={{ opacity: 1, y: 0 }} 
                                        exit={{ opacity: 0, y: 10 }} 
                                        className={`mx-auto transition-all duration-500 ease-in-out ${viewport === 'mobile' ? 'max-w-[420px] rounded-[3.5rem] border-[12px] border-[#1a1a24] shadow-[0_0_0_12px_rgba(255,255,255,0.05)] h-[850px]' : 'w-full rounded-[3rem] border border-white/5'}`}
                                    >
                                        <div className={`bg-gray-100 px-8 py-5 border-b border-gray-200 flex items-center space-x-6 ${viewport === 'mobile' ? 'hidden' : ''}`}><div className="flex space-x-2"><div className="w-3.5 h-3.5 bg-red-400 rounded-full" /><div className="w-3.5 h-3.5 bg-yellow-400 rounded-full" /><div className="w-3.5 h-3.5 bg-green-400 rounded-full" /></div><div className="bg-white px-5 py-2 rounded-xl text-[12px] text-gray-400 flex-1 flex items-center justify-between border border-gray-200"><span className="flex items-center space-x-2 font-medium tracking-tight"><Globe className="w-4 h-4 opacity-30" /><span>marketai.local/v/${salesPage.id}/${salesPage.product_name.toLowerCase().replace(/\s+/g, '-')}</span></span></div></div>
                                        <div className={`overflow-y-auto custom-scrollbar transition-all duration-1000 ${viewport === 'mobile' ? 'h-full rounded-[2.5rem]' : 'max-h-[1200px]'} ${salesPage.theme === 'corporate' || salesPage.theme === 'minimalist' ? 'bg-white text-slate-900' : salesPage.theme === 'dark_tech' ? 'bg-black text-green-400 font-mono' : salesPage.theme === 'vibrant' ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
                                            <div className={`max-w-5xl mx-auto text-center p-24 ${viewport === 'mobile' ? 'px-6 py-12 space-y-10' : 'space-y-16'}`}>
                                                <div className="group relative">
                                                    <h1 data-section="headline" onClick={(e) => handleTextClick(e, 'headline')} contentEditable suppressContentEditableWarning onBlur={(e) => handleBlur('headline', e.currentTarget.innerHTML)} className={`outline-none px-4 rounded-2xl hover:bg-indigo-500/5 transition-all cursor-text leading-[1.1] ${isMagicLoading && selectedSection === 'headline' ? 'animate-pulse-shimmer' : ''} ${viewport === 'mobile' ? 'text-3xl' : 'text-7xl'} ${salesPage.theme === 'corporate' || salesPage.theme === 'minimalist' ? 'font-serif text-slate-900' : salesPage.theme === 'dark_tech' ? 'font-bold uppercase italic' : salesPage.theme === 'vibrant' ? 'font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-indigo-400' : 'font-black text-slate-900'}`} dangerouslySetInnerHTML={{ __html: copy.headline }} />
                                                    <button onClick={() => handleRegenerate('headline')} className="absolute -right-12 top-0 p-3 opacity-0 group-hover:opacity-100 text-indigo-500 hover:bg-indigo-500/10 rounded-full transition-all"><RefreshCw className={`w-5 h-5 ${isRegenerating === 'headline' ? 'animate-spin' : ''}`} /></button>
                                                </div>
                                                <div className="group relative">
                                                    <p data-section="subheadline" onClick={(e) => handleTextClick(e, 'subheadline')} contentEditable suppressContentEditableWarning onBlur={(e) => handleBlur('subheadline', e.currentTarget.innerHTML)} className={`outline-none px-4 rounded-2xl max-w-3xl mx-auto transition-all cursor-text leading-relaxed ${isMagicLoading && selectedSection === 'subheadline' ? 'animate-pulse-shimmer' : ''} ${viewport === 'mobile' ? 'text-lg' : 'text-2xl'} ${salesPage.theme === 'corporate' || salesPage.theme === 'minimalist' ? 'text-slate-500 italic' : salesPage.theme === 'dark_tech' ? 'text-green-800' : 'text-slate-400'}`} dangerouslySetInnerHTML={{ __html: copy.subheadline }} />
                                                    <button onClick={() => handleRegenerate('subheadline')} className="absolute -right-12 top-0 p-3 opacity-0 group-hover:opacity-100 text-indigo-500 hover:bg-indigo-500/10 rounded-full transition-all"><RefreshCw className={`w-5 h-5 ${isRegenerating === 'subheadline' ? 'animate-spin' : ''}`} /></button>
                                                </div>
                                                <div className="group relative w-full aspect-video rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white/10 transform transition-all hover:scale-[1.01] bg-white/5 backdrop-blur-sm">
                                                    {/* Image Magic Toolbar */}
                                                    <div className="absolute top-6 left-1/2 -translate-x-1/2 flex items-center space-x-2 bg-black/60 backdrop-blur-xl border border-white/10 p-2 rounded-2xl opacity-0 group-hover:opacity-100 transition-all z-10 scale-90 group-hover:scale-100">
                                                        <button onClick={() => handleImageFilter('grayscale')} className={`p-3 rounded-xl transition-all ${imageFilters.grayscale ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white hover:bg-white/10'}`} title="Grayscale"><ImageIcon className="w-4 h-4" /></button>
                                                        <button onClick={() => handleImageFilter('invert')} className={`p-3 rounded-xl transition-all ${imageFilters.invert ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white hover:bg-white/10'}`} title="Invert Colors"><Zap className="w-4 h-4" /></button>
                                                        <button onClick={() => handleImageFilter('sepia')} className={`p-3 rounded-xl transition-all ${imageFilters.sepia ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white hover:bg-white/10'}`} title="Sepia Mood"><Palette className="w-4 h-4" /></button>
                                                        <div className="h-6 w-px bg-white/10 mx-1" />
                                                        <button onClick={() => handleRegenerateImage()} className="p-3 rounded-xl text-indigo-400 hover:bg-indigo-500/10 transition-all" title="New AI Image"><RefreshCw className="w-4 h-4" /></button>
                                                    </div>

                                                    <img 
                                                        src={heroImage} 
                                                        alt="Magic Hero" 
                                                        referrerPolicy="no-referrer"
                                                        className={`w-full h-full object-cover transition-all duration-700 ${salesPage.settings?.image_filters?.grayscale ? 'grayscale' : ''} ${salesPage.settings?.image_filters?.invert ? 'invert' : ''} ${salesPage.settings?.image_filters?.sepia ? 'sepia' : ''}`}
                                                        onError={(e) => {
                                                            e.currentTarget.onerror = null;
                                                            e.currentTarget.src = getFallbackImage();
                                                        }}
                                                        className={`w-full h-full object-cover transition-all duration-1000 ${salesPage.theme === 'dark_tech' ? 'grayscale invert brightness-50 contrast-150' : ''}`} 
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
                                                    <div className="absolute top-6 right-6 flex items-center space-x-2">
                                                        {/* Floating Style Selector */}
                                                        <div className="relative group/style">
                                                            <button className="bg-white/20 hover:bg-white/30 backdrop-blur-md px-4 py-2 rounded-full flex items-center space-x-2 border border-white/30 text-white shadow-xl transition-all">
                                                                <Palette className="w-3 h-3" />
                                                                <span className="text-[10px] font-black uppercase tracking-widest">{salesPage.image_style}</span>
                                                            </button>
                                                            
                                                            {/* Dropdown Menu */}
                                                            <div className="absolute top-full right-0 mt-2 w-48 bg-[#1a1a24] border border-white/10 rounded-2xl p-2 shadow-2xl opacity-0 invisible group-hover/style:opacity-100 group-hover/style:visible transition-all z-50">
                                                                {[
                                                                    { id: 'cinematic', name: 'Cinematic' },
                                                                    { id: 'minimalist white', name: 'Minimalist' },
                                                                    { id: 'cyberpunk neon', name: 'Cyberpunk' },
                                                                    { id: 'professional office', name: 'Corporate' },
                                                                    { id: '3d render toy', name: 'Playful 3D' },
                                                                    { id: 'abstract gradient', name: 'Abstract' },
                                                                ].map((s) => (
                                                                    <button 
                                                                        key={s.id} 
                                                                        onClick={() => handleUpdateImageStyle(s.id)}
                                                                        className={`w-full text-left px-4 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${salesPage.image_style === s.id ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                                                                    >
                                                                        {s.name}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </div>

                                                        <button 
                                                            onClick={handleRegenerateImage}
                                                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-full flex items-center space-x-2 shadow-xl transition-all"
                                                        >
                                                            <RefreshCw className="w-3 h-3" />
                                                            <span className="text-[10px] font-black uppercase tracking-widest">Regenerate</span>
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="group relative">
                                                    <button data-section="cta" onClick={(e) => handleTextClick(e, 'cta')} contentEditable suppressContentEditableWarning onBlur={(e) => handleBlur('cta', e.currentTarget.innerHTML)} className={`outline-none px-12 py-6 rounded-full font-black text-xl shadow-2xl transition-all transform hover:scale-110 active:scale-95 ${isMagicLoading && selectedSection === 'cta' ? 'animate-pulse-shimmer' : ''} ${salesPage.theme === 'corporate' ? 'bg-blue-900 text-white' : salesPage.theme === 'minimalist' ? 'bg-slate-900 text-white' : salesPage.theme === 'dark_tech' ? 'bg-green-500 text-black border-2 border-black' : salesPage.theme === 'vibrant' ? 'bg-gradient-to-r from-indigo-500 via-purple-600 to-fuchsia-600 text-white shadow-fuchsia-500/20' : 'bg-indigo-600 text-white'}`} dangerouslySetInnerHTML={{ __html: copy.cta }} />
                                                    <button onClick={() => handleRegenerate('cta')} className="absolute -right-12 top-1/2 -translate-y-1/2 p-3 opacity-0 group-hover:opacity-100 text-indigo-500 hover:bg-indigo-500/10 rounded-full transition-all"><RefreshCw className={`w-5 h-5 ${isRegenerating === 'cta' ? 'animate-spin' : ''}`} /></button>
                                                </div>
                                                <div className={`grid gap-20 text-left pt-24 border-t ${viewport === 'mobile' ? 'grid-cols-1 gap-12' : 'grid-cols-2'} ${salesPage.theme === 'corporate' || salesPage.theme === 'minimalist' ? 'border-slate-100' : salesPage.theme === 'dark_tech' ? 'border-green-500/20' : 'border-white/10'}`}>
                                                    <div className="group relative">
                                                        <h4 className={`text-[11px] font-black uppercase tracking-[0.3em] mb-6 ${salesPage.theme === 'dark_tech' ? 'text-green-500' : 'text-red-500'}`}>The Pain Point</h4>
                                                        <p data-section="problem" onClick={(e) => handleTextClick(e, 'problem')} contentEditable suppressContentEditableWarning onBlur={(e) => handleBlur('problem', e.currentTarget.innerHTML)} className={`outline-none text-2xl leading-relaxed cursor-text ${isMagicLoading && selectedSection === 'problem' ? 'animate-pulse-shimmer' : ''}`} dangerouslySetInnerHTML={{ __html: copy.problem }} />
                                                        <button onClick={() => handleRegenerate('problem')} className="absolute -right-10 top-0 p-3 opacity-0 group-hover:opacity-100 text-indigo-500 hover:bg-indigo-500/10 rounded-full transition-all"><RefreshCw className={`w-4 h-4 ${isRegenerating === 'problem' ? 'animate-spin' : ''}`} /></button>
                                                    </div>
                                                    <div className="group relative">
                                                        <h4 className={`text-[11px] font-black uppercase tracking-[0.3em] mb-6 ${salesPage.theme === 'dark_tech' ? 'text-green-300' : 'text-green-500'}`}>The Solution</h4>
                                                        <p data-section="solution" onClick={(e) => handleTextClick(e, 'solution')} contentEditable suppressContentEditableWarning onBlur={(e) => handleBlur('solution', e.currentTarget.innerHTML)} className={`outline-none text-2xl leading-relaxed cursor-text ${isMagicLoading && selectedSection === 'solution' ? 'animate-pulse-shimmer' : ''}`} dangerouslySetInnerHTML={{ __html: copy.solution }} />
                                                        <button onClick={() => handleRegenerate('solution')} className="absolute -right-10 top-0 p-3 opacity-0 group-hover:opacity-100 text-indigo-500 hover:bg-indigo-500/10 rounded-full transition-all"><RefreshCw className={`w-4 h-4 ${isRegenerating === 'solution' ? 'animate-spin' : ''}`} /></button>
                                                    </div>
                                                </div>

                                                {/* Testimonials Section */}
                                                {salesPage.settings?.visible_sections?.testimonials && (
                                                    <div className="pt-24">
                                                        <h3 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-12 text-center ${salesPage.theme === 'dark_tech' ? 'text-green-500' : 'text-gray-400'}`}>What People Say</h3>
                                                        
                                                        {isRegenerating === 'testimonials' ? (
                                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                                                {[1, 2, 3].map((i) => (
                                                                    <div key={i} className={`p-8 rounded-3xl border animate-pulse-shimmer ${salesPage.theme === 'dark_tech' ? 'bg-white/5 border-green-500/20' : 'bg-slate-50 border-slate-100'}`}>
                                                                        <div className="h-4 bg-gray-400/20 rounded-full w-full mb-3" />
                                                                        <div className="h-4 bg-gray-400/20 rounded-full w-5/6 mb-8" />
                                                                        <div className="flex items-center space-x-3">
                                                                            <div className="w-10 h-10 rounded-full bg-gray-400/20" />
                                                                            <div className="space-y-2">
                                                                                <div className="h-3 bg-gray-400/20 rounded-full w-20" />
                                                                                <div className="h-2 bg-gray-400/20 rounded-full w-12" />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        ) : copy.testimonials ? (
                                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                                                {copy.testimonials.map((t: any, i: number) => (
                                                                    <div key={i} className={`p-8 rounded-3xl border group/card hover:scale-105 transition-all ${salesPage.theme === 'dark_tech' ? 'bg-white/5 border-green-500/20 text-green-400' : 'bg-white border-slate-100 shadow-sm'}`}>
                                                                        <p className="italic mb-6">"{t.content}"</p>
                                                                        <div className="flex items-center space-x-3">
                                                                            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">{t.name[0]}</div>
                                                                            <div>
                                                                                <div className="font-bold text-sm">{t.name}</div>
                                                                                <div className="text-[10px] opacity-50 uppercase tracking-wider">{t.role}</div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <button onClick={() => handleRegenerate('testimonials')} className="w-full py-20 border-2 border-dashed border-white/10 rounded-[3rem] hover:bg-white/5 transition-all group">
                                                                <div className="flex flex-col items-center space-y-4">
                                                                    <div className="p-4 bg-purple-500/20 rounded-2xl text-purple-400 group-hover:scale-110 transition-all"><Zap className="w-8 h-8" /></div>
                                                                    <div className="font-bold text-gray-500">Generate Testimonials with AI</div>
                                                                </div>
                                                            </button>
                                                        )}
                                                    </div>
                                                )}

                                                {/* FAQ Section */}
                                                {salesPage.settings?.visible_sections?.faq && (
                                                    <div className="pt-24 text-left max-w-3xl mx-auto">
                                                        <h3 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-12 text-center ${salesPage.theme === 'dark_tech' ? 'text-green-500' : 'text-gray-400'}`}>Common Questions</h3>
                                                        
                                                        {isRegenerating === 'faq' ? (
                                                            <div className="space-y-4">
                                                                {[1, 2, 3, 4].map((i) => (
                                                                    <div key={i} className={`p-6 rounded-2xl border animate-pulse-shimmer ${salesPage.theme === 'dark_tech' ? 'bg-black border-green-500/20' : 'bg-slate-50 border-slate-100'}`}>
                                                                        <div className="h-4 bg-gray-400/20 rounded-full w-2/3 mb-4" />
                                                                        <div className="h-3 bg-gray-400/20 rounded-full w-full" />
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        ) : copy.faq ? (
                                                            <div className="space-y-4">
                                                                {copy.faq.map((f: any, i: number) => (
                                                                    <div key={i} className={`p-6 rounded-2xl border hover:border-indigo-500/30 transition-all ${salesPage.theme === 'dark_tech' ? 'bg-black border-green-500/20' : 'bg-white border-slate-100 shadow-sm'}`}>
                                                                        <div className="font-bold mb-2 flex items-center space-x-2 text-indigo-500">
                                                                            <span>Q:</span>
                                                                            <span className={salesPage.theme === 'dark_tech' ? 'text-green-400' : 'text-slate-900'}>{f.question}</span>
                                                                        </div>
                                                                        <div className="opacity-60 text-sm leading-relaxed">{f.answer}</div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <button onClick={() => handleRegenerate('faq')} className="w-full py-20 border-2 border-dashed border-white/10 rounded-[3rem] hover:bg-white/5 transition-all group">
                                                                <div className="flex flex-col items-center space-y-4">
                                                                    <div className="p-4 bg-indigo-500/20 rounded-2xl text-indigo-400 group-hover:scale-110 transition-all"><Zap className="w-8 h-8" /></div>
                                                                    <div className="font-bold text-gray-500">Generate FAQ with AI</div>
                                                                </div>
                                                            </button>
                                                        )}
                                                    </div>
                                                )}

                                                <div className="pt-24 pb-16">
                                                    <div className={`rounded-[4rem] p-24 shadow-2xl relative overflow-hidden group transition-all ${salesPage.theme === 'minimalist' ? 'bg-slate-900 text-white' : salesPage.theme === 'corporate' ? 'bg-blue-950 text-white' : salesPage.theme === 'dark_tech' ? 'bg-black border-4 border-green-500 text-green-500' : 'bg-indigo-950 text-white shadow-indigo-500/10'}`}>
                                                        <h2 className="text-4xl font-bold mb-10">Start Your Journey</h2>
                                                        <div data-section="pricing_display" onClick={(e) => handleTextClick(e, 'pricing_display')} contentEditable suppressContentEditableWarning onBlur={(e) => handleBlur('pricing_display', e.currentTarget.innerHTML)} className={`font-black mb-12 tracking-tighter outline-none cursor-text ${isMagicLoading && selectedSection === 'pricing_display' ? 'animate-pulse-shimmer' : ''} ${viewport === 'mobile' ? 'text-6xl' : 'text-9xl'}`} dangerouslySetInnerHTML={{ __html: copy.pricing_display }} />
                                                        <p data-section="social_proof_placeholder" onClick={(e) => handleTextClick(e, 'social_proof_placeholder')} contentEditable suppressContentEditableWarning onBlur={(e) => handleBlur('social_proof_placeholder', e.currentTarget.innerHTML)} className={`text-xl opacity-60 mb-16 max-w-lg mx-auto outline-none cursor-text leading-relaxed ${isMagicLoading && selectedSection === 'social_proof_placeholder' ? 'animate-pulse-shimmer' : ''}`} dangerouslySetInnerHTML={{ __html: copy.social_proof_placeholder }} />
                                                        <button className={`px-16 py-7 rounded-full font-black text-2xl transition-all transform hover:scale-110 active:scale-95 bg-white ${salesPage.theme === 'dark_tech' ? 'text-black' : 'text-indigo-900'}`}>{copy.cta}</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ) : activeTab === 'conversion' ? (
                                    <motion.div key="conversion" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="bg-[#121217] border border-white/10 rounded-[2.5rem] p-10">
                                        <div className="flex justify-between items-center mb-10 pb-6 border-b border-white/5">
                                            <h3 className="text-2xl font-bold text-white">Conversion Settings</h3>
                                            <div className="flex items-center space-x-2 bg-green-500/10 text-green-400 px-3 py-1 rounded-full border border-green-500/20">
                                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                                <span className="text-[10px] font-black uppercase tracking-widest">WhatsApp Active</span>
                                            </div>
                                        </div>
                                        
                                        <div className="space-y-8">
                                            <div className="space-y-4">
                                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Target CTA</label>
                                                <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10">
                                                    <button className="flex-1 py-3 px-4 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-lg">WhatsApp Business</button>
                                                    <button className="flex-1 py-3 px-4 text-gray-500 hover:text-white transition-colors text-xs font-bold">Email (Soon)</button>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">WhatsApp Number</label>
                                                <input 
                                                    type="text" 
                                                    placeholder="e.g. 628123456789"
                                                    value={waNumber}
                                                    onChange={(e) => setWaNumber(e.target.value)}
                                                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl p-6 text-white text-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all outline-none"
                                                />
                                                <p className="text-[10px] text-gray-500 italic">Start with country code (e.g. 62 for Indonesia)</p>
                                            </div>

                                            <div className="space-y-4">
                                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Custom Message</label>
                                                <textarea 
                                                    rows={4}
                                                    value={waMessage}
                                                    onChange={(e) => setWaMessage(e.target.value)}
                                                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl p-6 text-white text-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all outline-none resize-none"
                                                />
                                            </div>

                                            <div className="p-6 bg-indigo-500/5 border border-indigo-500/10 rounded-[2rem]">
                                                <h4 className="text-sm font-bold text-indigo-400 mb-2">💡 Pro Tip</h4>
                                                <p className="text-xs text-gray-500 leading-relaxed">
                                                    Linking your CTA to WhatsApp can increase conversion rates by up to 40% in some markets. Make sure your message is welcoming!
                                                </p>
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
            <style dangerouslySetInnerHTML={{ __html: `
                .custom-scrollbar::-webkit-scrollbar { width: 8px; } 
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; } 
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.05); border-radius: 20px; }
                
                .animate-pulse-shimmer {
                    background: linear-gradient(
                        90deg, 
                        rgba(99, 102, 241, 0.1) 25%, 
                        rgba(99, 102, 241, 0.3) 50%, 
                        rgba(99, 102, 241, 0.1) 75%
                    );
                    background-size: 200% 100%;
                    animation: shimmer 1.5s infinite;
                    border-radius: 0.5rem;
                    color: transparent !important;
                }

                @keyframes shimmer {
                    0% { background-position: 200% 0; }
                    100% { background-position: -200% 0; }
                }

                @media print {
                    .no-print { display: none !important; }
                    body { background: white !important; color: black !important; }
                    .bg-white, .bg-slate-50 { background: white !important; }
                    .bg-slate-950, .bg-black, .bg-indigo-950 { background: white !important; color: black !important; border: 1px solid #eee; }
                    .text-white, .text-indigo-400, .text-green-400 { color: black !important; }
                    button { display: none !important; }
                    .shadow-2xl, .shadow-xl { shadow: none !important; }
                    .rounded-[3rem], .rounded-[4rem] { border-radius: 1rem !important; }
                    .max-h-[1200px] { max-height: none !important; overflow: visible !important; }
                    nav, header:not(.sales-header), .lg\\:col-span-1 { display: none !important; }
                    .lg\\:col-span-4 { width: 100% !important; margin: 0 !important; }
                }
            `}} />
        </AuthenticatedLayout>
    );
}
