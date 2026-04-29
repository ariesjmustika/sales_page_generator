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
            faq?: Array<{question: string, answer: string}>;
            testimonials?: Array<{name: string, role: string, content: string}>;
            meta_title?: string;
            meta_description?: string;
        };
        theme: string;
        image_style: string;
        image_seed: number;
        settings?: {
            visible_sections?: {
                faq?: boolean;
                testimonials?: boolean;
            };
            whatsapp_number?: string;
            whatsapp_message?: string;
            image_filters?: {
                grayscale?: boolean;
                invert?: boolean;
                sepia?: boolean;
            };
        };
        created_at: string;
    };
}

export default function Preview({ salesPage }: Props) {
    const [copy, setCopy] = useState(salesPage.generated_copy);
    const [activeTab, setActiveTab] = useState<'preview' | 'content' | 'conversion'>('preview');
    const [viewport, setViewport] = useState<'desktop' | 'mobile'>('desktop');

    // Auto-detect viewport on mount
    useEffect(() => {
        if (typeof window !== 'undefined' && window.innerWidth < 1024) {
            setViewport('mobile');
        }
    }, []);
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
        
        return `https://picsum.photos/seed/${salesPage.uuid}/1200/800`;
    };

    useEffect(() => {
        setCopy(salesPage.generated_copy);
    }, [salesPage.generated_copy]);

    const handleUpdateContent = (path: string, value: any) => {
        const newCopy = JSON.parse(JSON.stringify(copy));
        const parts = path.split('.');
        let current = newCopy;
        
        for (let i = 0; i < parts.length - 1; i++) {
            current = current[parts[i]];
        }
        current[parts[parts.length - 1]] = value;
        
        setCopy(newCopy);
        saveManualEdit(newCopy);
    };

    const saveManualEdit = (updatedCopy: any) => {
        setIsSaving(true);
        router.post(route('sales-pages.update-copy', salesPage.uuid), {
            generated_copy: updatedCopy
        }, {
            preserveScroll: true,
            onSuccess: () => setIsSaving(false),
            onFinish: () => setIsSaving(false),
        });
    };

    const handleRegenerate = (section: string) => {
        setIsRegenerating(section);
        router.post(route('sales-pages.regenerate', salesPage.uuid), {
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
        router.post(route('sales-pages.update-theme', salesPage.uuid), {
            theme: theme
        }, {
            preserveScroll: true,
            onSuccess: () => toast.success(`Theme switched to ${theme}!`),
        });
    };

    const handleUpdateImageStyle = (style: string) => {
        router.post(route('sales-pages.image-style', salesPage.uuid), {
            image_style: style
        }, {
            preserveScroll: true,
            onSuccess: () => toast.success(`Image style set to ${style}!`),
        });
    };

    const handleRegenerateImage = () => {
        router.post(route('sales-pages.regenerate-image', salesPage.uuid), {}, {
            preserveScroll: true,
            onSuccess: () => toast.success('New image generated!'),
        });
    };

    const handleDelete = () => {
        router.delete(route('sales-pages.destroy', salesPage.uuid), {
            onFinish: () => {
                setShowDeleteModal(false);
            }
        });
    };

    // Responsive Sidebar State
    const [showSidebar, setShowSidebar] = useState(false);

    // Magic Toolbar State
    const [toolbarPos, setToolbarPos] = useState<{ top: number, left: number } | null>(null);
    const [selectedSection, setSelectedSection] = useState<string | null>(null);
    const [selectedText, setSelectedText] = useState("");
    const [isMagicLoading, setIsMagicLoading] = useState(false);

    const handleImageFilter = (filter: string) => {
        const currentFilters = salesPage.settings?.image_filters || { grayscale: false, invert: false, sepia: false };
        const newFilters = { ...currentFilters, [filter]: !currentFilters[filter as keyof typeof currentFilters] };
        
        const newSettings = { ...salesPage.settings, image_filters: newFilters };
        router.post(route('sales-pages.update-settings', salesPage.uuid), { settings: newSettings }, { preserveScroll: true });
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
        router.post(route('sales-pages.magic-rewrite', salesPage.uuid), {
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
                    if (el) {
                        // Resolve value from potentially nested key path (e.g. "benefits.0")
                        let val = newCopy;
                        const parts = selectedSection.split('.');
                        for (const part of parts) {
                            val = val?.[part];
                        }
                        if (typeof val === 'string') {
                            // Update both DOM and force a re-render
                            (el as HTMLElement).innerText = val;
                        }
                    }
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

    const handleBlur = (section: string, text: string) => {
        // Prevent manual save if AI is processing or if the toolbar is open (to avoid race conditions)
        if (isMagicLoading || toolbarPos) return; 
        
        // Resolve current value from potentially nested key path for comparison
        let currentVal = copy;
        const parts = section.split('.');
        for (const part of parts) {
            currentVal = currentVal?.[part];
        }

        const cleanText = text.trim();
        if (cleanText === currentVal) return; // No change, no save
        
        handleUpdateContent(section, cleanText);
    };

    const handleUpdateImageKeyword = (keyword: string) => {
        const newCopy = { ...copy, image_keyword: keyword };
        setCopy(newCopy);
        saveManualEdit(newCopy);
        toast.success(`Visual concept updated!`);
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
                router.post(route('sales-pages.update-settings', salesPage.uuid), { settings: newSettings }, { 
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
        
        const waNumberFormatted = salesPage.settings?.whatsapp_number?.replace(/\D/g, '');
        const waMessageEncoded = encodeURIComponent(salesPage.settings?.whatsapp_message || '');
        const waLink = waNumberFormatted ? `https://wa.me/${waNumberFormatted}?text=${waMessageEncoded}` : '#';

        const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${copy.meta_title || `${salesPage.product_name} - Sales Page`}</title>
    <meta name="description" content="${copy.meta_description || ''}">
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&family=Playfair+Display:wght@700&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Inter', sans-serif; scroll-behavior: smooth; -webkit-font-smoothing: antialiased; }
        .font-serif { font-family: 'Playfair Display', serif; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
        .glass { background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.08); }
        .glass-dark { background: rgba(0, 0, 0, 0.4); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.05); }
        .text-gradient { background: linear-gradient(to right, #818cf8, #c084fc, #818cf8); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-size: 200% auto; }
        .btn-gradient { background: linear-gradient(to right, #6366f1, #a855f7, #ec4899); transition: 0.5s; background-size: 200% auto; }
        .btn-gradient:hover { background-position: right center; }
    </style>
</head>
<body class="${isCorporate || isMinimal ? 'bg-white text-slate-900' : isDarkTech ? 'bg-black text-green-400' : isVibrant ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}">
    
    <!-- Hero Section -->
    <header class="py-32 px-6 max-w-6xl mx-auto flex flex-col items-center text-center space-y-16">
        <div class="flex items-center space-x-2 opacity-40 scale-90 mb-4">
            <div class="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-white text-lg">M</div>
            <span class="font-bold tracking-tight ${isCorporate || isMinimal ? 'text-slate-900' : 'text-white'}">MarketAI</span>
        </div>

        <h1 class="text-6xl md:text-8xl font-black tracking-tight leading-[1.05] ${isCorporate || isMinimal ? 'font-serif text-slate-900' : isDarkTech ? 'font-mono uppercase italic' : isVibrant ? 'text-gradient' : 'text-slate-900'}">
            ${copy.headline}
        </h1>

        <p class="text-xl md:text-3xl max-w-3xl mx-auto leading-relaxed ${isCorporate || isMinimal ? 'text-slate-500 italic' : isDarkTech ? 'text-green-800' : 'text-slate-400'}">
            ${copy.subheadline}
        </p>

        <div class="w-full aspect-video rounded-[3.5rem] overflow-hidden shadow-[0_40px_80px_-15px_rgba(0,0,0,0.3)] border-8 ${isCorporate ? 'border-slate-50' : isDarkTech ? 'border-green-500/20' : 'border-white/5'}">
            <img src="${heroImage}" alt="Hero" class="w-full h-full object-cover ${salesPage.settings?.image_filters?.grayscale ? 'grayscale' : ''} ${salesPage.settings?.image_filters?.invert ? 'invert' : ''} ${salesPage.settings?.image_filters?.sepia ? 'sepia' : ''} ${isDarkTech && !salesPage.settings?.image_filters ? 'grayscale invert brightness-50 contrast-150' : ''}" />
        </div>

        <a href="${waLink}" class="inline-block px-16 py-7 rounded-full text-2xl font-black transition-all transform hover:scale-105 active:scale-95 shadow-2xl ${isCorporate ? 'bg-blue-900 text-white' : isMinimal ? 'bg-slate-900 text-white' : isDarkTech ? 'bg-green-500 text-black border-2 border-black' : 'btn-gradient text-white'}">
            ${copy.cta}
        </a>
    </header>

    <!-- Core Pitch -->
    <section class="py-40 ${isCorporate || isMinimal ? 'bg-slate-50' : isDarkTech ? 'bg-white/5 border-y border-green-500/20' : 'bg-white/5'}">
        <div class="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-24 text-left">
            <div class="space-y-8">
                <h4 class="text-xs font-black uppercase tracking-[0.4em] ${isDarkTech ? 'text-green-500' : 'text-red-500'} opacity-60">The Pain Point</h4>
                <p class="text-3xl md:text-4xl font-bold leading-tight">${copy.problem}</p>
            </div>
            <div class="space-y-8">
                <h4 class="text-xs font-black uppercase tracking-[0.4em] ${isDarkTech ? 'text-green-300' : 'text-green-500'} opacity-60">The Solution</h4>
                <p class="text-3xl md:text-4xl font-bold leading-tight">${copy.solution}</p>
            </div>
        </div>
    </section>

    <!-- Benefits Grid -->
    <section class="py-40 px-6 max-w-7xl mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-10 text-left">
            ${copy.benefits.map(benefit => `
                <div class="p-12 rounded-[3.5rem] transition-all ${isCorporate || isMinimal ? 'bg-white border border-slate-100 shadow-xl shadow-slate-200/50' : 'glass'}">
                    <div class="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-8 text-indigo-400">
                        <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
                    </div>
                    <p class="text-xl font-bold leading-snug">${benefit}</p>
                </div>
            `).join('')}
        </div>
    </section>

    <!-- Features Breakdown -->
    <section class="py-40 ${isCorporate || isMinimal ? 'bg-slate-50' : 'bg-white/5'}">
        <div class="max-w-7xl mx-auto px-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-20 text-left">
                ${copy.features_breakdown.map(f => `
                    <div class="flex space-x-10 group">
                        <div class="flex-shrink-0 w-20 h-20 rounded-[2rem] flex items-center justify-center text-white text-2xl font-black shadow-2xl ${isDarkTech ? 'bg-green-600 shadow-green-500/30' : 'bg-indigo-600 shadow-indigo-600/30'}">
                            ${f.title.charAt(0)}
                        </div>
                        <div class="space-y-4">
                            <h4 class="text-3xl font-black tracking-tight">${f.title}</h4>
                            <p class="text-lg opacity-60 leading-relaxed">${f.description}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    </section>

    ${copy.testimonials && (salesPage.settings?.visible_sections?.testimonials ?? true) ? `
    <!-- Testimonials -->
    <section class="py-40 px-6 max-w-7xl mx-auto">
        <h3 class="text-xs font-black uppercase tracking-[0.4em] mb-20 text-center opacity-40">What People Say</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-10">
            ${copy.testimonials.map(t => `
                <div class="p-12 rounded-[4rem] transition-all ${isDarkTech ? 'glass-dark text-green-400' : 'bg-white border border-slate-100 shadow-2xl shadow-slate-200/40'}">
                    <p class="text-xl italic mb-10 opacity-80 leading-relaxed">"${t.content}"</p>
                    <div class="flex items-center space-x-5">
                        <div class="w-14 h-14 rounded-full bg-indigo-500/10 flex items-center justify-center font-bold text-indigo-500 text-xl">${t.name.charAt(0)}</div>
                        <div><div class="font-bold text-lg">${t.name}</div><div class="text-xs opacity-50 uppercase tracking-widest font-black">${t.role}</div></div>
                    </div>
                </div>
            `).join('')}
        </div>
    </section>
    ` : ''}

    ${copy.faq && (salesPage.settings?.visible_sections?.faq ?? true) ? `
    <!-- FAQ Section -->
    <section class="py-40 px-6 max-w-4xl mx-auto text-left">
        <h3 class="text-xs font-black uppercase tracking-[0.4em] mb-20 text-center opacity-40">Common Questions</h3>
        <div class="space-y-8">
            ${copy.faq.map(f => `
                <div class="p-10 rounded-[3rem] ${isDarkTech ? 'glass-dark' : 'bg-white border border-slate-50 shadow-xl shadow-slate-100'}">
                    <h4 class="font-black text-2xl mb-5 text-indigo-500 flex items-center space-x-4">
                        <span class="opacity-30">Q:</span>
                        <span class="${isDarkTech ? 'text-green-400' : 'text-slate-900'}">${f.question}</span>
                    </h4>
                    <p class="text-lg opacity-60 leading-relaxed ml-12">${f.answer}</p>
                </div>
            `).join('')}
        </div>
    </section>
    ` : ''}

    <!-- Final Call to Action -->
    <section class="py-40 px-6">
        <div class="max-w-5xl mx-auto rounded-[5rem] p-32 text-center relative overflow-hidden ${isMinimal ? 'bg-slate-900 text-white' : isCorporate ? 'bg-blue-950 text-white' : isDarkTech ? 'bg-black border-4 border-green-500 text-green-500 shadow-[0_0_50px_rgba(34,197,94,0.2)]' : 'bg-indigo-950 text-white shadow-[0_50px_100px_-20px_rgba(79,70,229,0.3)]'}">
            <h2 class="text-4xl font-bold mb-12 opacity-80">Start Your Journey</h2>
            <div class="text-8xl md:text-[10rem] font-black mb-16 tracking-tighter leading-none">${copy.pricing_display}</div>
            <p class="text-2xl md:text-3xl mb-20 max-w-xl mx-auto opacity-60 leading-relaxed">${copy.social_proof_placeholder}</p>
            <a href="${waLink}" class="inline-block px-20 py-8 rounded-full text-3xl font-black bg-white ${isDarkTech ? 'text-black' : 'text-indigo-900'} transform transition-all hover:scale-110 active:scale-95 shadow-2xl shadow-black/20">
                ${copy.cta}
            </a>
        </div>
    </section>

    <footer class="py-24 text-center">
        <div class="flex flex-col items-center space-y-6 opacity-30">
            <div class="flex items-center space-x-3 text-sm font-bold uppercase tracking-widest">
                <span>Built with</span>
                <svg class="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"></path></svg>
                <span>using MarketAI Platform • ${new Date().getFullYear()}</span>
            </div>
            <p class="text-[10px] font-black uppercase tracking-[0.5em]">&copy; ${salesPage.product_name}</p>
        </div>
    </footer>

    <!-- Sticky Mobile CTA -->
    <div class="md:hidden fixed bottom-6 left-6 right-6 z-[100]">
        <a href="${waLink}" class="block w-full py-5 btn-gradient text-white rounded-2xl font-black text-xl text-center shadow-2xl shadow-indigo-600/40 border border-white/20 active:scale-95 transition-all flex items-center justify-center space-x-3">
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.246 2.248 3.484 5.232 3.484 8.412-.003 6.557-5.338 11.892-11.893 11.892-1.997-.001-3.951-.5-5.688-1.448l-6.309 1.656zm6.29-4.143c1.589.943 3.133 1.415 4.75 1.416 5.482.002 9.944-4.461 9.947-9.945.002-2.657-1.032-5.155-2.908-7.03s-4.373-2.912-7.027-2.914c-5.483 0-9.944 4.463-9.947 9.948 0 1.742.483 3.443 1.397 4.912l-.938 3.425 3.52-.922zm10.536-7.304c-.297-.148-1.757-.867-2.03-.967-.272-.099-.47-.148-.668.148-.198.297-.767.967-.94 1.165-.173.198-.346.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.073-.124-.271-.198-.568-.347z"/></svg>
            <span>Hubungi Sekarang</span>
        </a>
    </div>

</body>
</html>
        `;
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url;
        a.download = `${salesPage.product_name.toLowerCase().replace(/\s+/g, '-')}-sales-page.html`;
        document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
        toast.success('Professional Standalone Site Exported!');
    };

    const isVibrant = salesPage.theme === 'vibrant';
    const isCorporate = salesPage.theme === 'corporate';
    const isDarkTech = salesPage.theme === 'dark_tech';
    const isMinimal = salesPage.theme === 'minimalist';

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
                                const url = `${window.location.origin}/v/${salesPage.uuid}`;
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
            <style>{`
                @media print {
                    .no-print { display: none !important; }
                    .printable-content { 
                        position: absolute !important;
                        left: 0 !important;
                        top: 0 !important;
                        width: 100% !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        border: none !important;
                        box-shadow: none !important;
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                    body { background: white !important; }
                    .custom-scrollbar { overflow: visible !important; height: auto !important; max-height: none !important; }
                    nav, header:not(.printable-content header) { display: none !important; }
                }
            `}</style>
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
                    <div className={`grid grid-cols-1 lg:grid-cols-5 gap-8 relative`}>
                        {/* Mobile Sticky Header */}
                        <div className="lg:hidden sticky top-0 left-0 right-0 z-[110] bg-[#0a0a0c]/80 backdrop-blur-md border-b border-white/10 p-4 flex items-center justify-between no-print">
                            <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                                    <span className="text-white font-bold text-sm">M</span>
                                </div>
                                <span className="font-bold text-white text-sm tracking-tight">MarketAI Editor</span>
                            </div>
                            <button 
                                onClick={() => setShowSidebar(!showSidebar)}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-xl shadow-lg flex items-center space-x-2 active:scale-95 transition-transform"
                            >
                                <Layout className="w-4 h-4" />
                                <span className="text-xs font-bold uppercase tracking-widest">Menu</span>
                            </button>
                        </div>

                        {/* Control Panel */}
                        <div className={`lg:col-span-1 space-y-6 no-print fixed lg:relative inset-0 z-[200] lg:z-0 lg:block bg-black/95 lg:bg-transparent backdrop-blur-2xl lg:backdrop-blur-none p-6 lg:p-0 transition-all duration-300 ${showSidebar ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0 lg:translate-x-0 lg:opacity-100'}`}>
                            <div className="bg-[#121217] border border-white/10 rounded-3xl p-6 sticky top-24 max-h-[calc(100vh-40px)] overflow-y-auto custom-scrollbar pb-20 lg:pb-6">
                                <div className="flex items-center justify-between lg:hidden mb-8">
                                    <h2 className="text-xl font-bold text-white tracking-tight">Editor Controls</h2>
                                    <button onClick={() => setShowSidebar(false)} className="p-3 bg-white/5 rounded-2xl active:scale-90 transition-transform"><X className="w-6 h-6 text-gray-400" /></button>
                                </div>
                                <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-6">Interface</h3>
                                <div className="space-y-2">
                                    <button onClick={() => setActiveTab('preview')} className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-2xl transition-all ${activeTab === 'preview' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-inner' : 'text-gray-500 hover:bg-white/5'}`}><Layout className="w-5 h-5" /><span className="font-bold text-sm">Visual Editor</span></button>
                                    <button onClick={() => setActiveTab('conversion')} className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-2xl transition-all ${activeTab === 'conversion' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-inner' : 'text-gray-500 hover:bg-white/5'}`}><Zap className="w-5 h-5" /><span className="font-bold text-sm">Conversion</span></button>
                                    <button onClick={() => setActiveTab('content')} className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-2xl transition-all ${activeTab === 'content' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-inner' : 'text-gray-500 hover:bg-white/5'}`}><Globe className="w-5 h-5" /><span className="font-bold text-sm">Raw Data</span></button>
                                </div>
                                
                                {activeTab === 'preview' && (
                                    <div className="mt-8 pt-8 border-t border-white/5 hidden lg:block">
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
                                                        router.post(route('sales-pages.update-settings', salesPage.uuid), { settings: newSettings }, { preserveScroll: true });
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
                                                        router.post(route('sales-pages.update-settings', salesPage.uuid), { settings: newSettings }, { preserveScroll: true });
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
                                        initial={{ opacity: 0, scale: 0.95 }} 
                                        animate={{ opacity: 1, scale: 1 }} 
                                        exit={{ opacity: 0, scale: 0.95 }} 
                                        className={`mx-auto transition-all duration-500 ease-in-out printable-content ${viewport === 'mobile' ? 'max-w-[min(420px,100%)] lg:rounded-[3.5rem] lg:border-[12px] lg:border-[#1a1a24] lg:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.5)] h-auto lg:h-[850px]' : 'w-full lg:rounded-[3rem] border border-white/5'}`}
                                    >
                                        <div className={`bg-gray-100 px-8 py-5 border-b border-gray-200 flex items-center space-x-6 no-print ${viewport === 'mobile' ? 'hidden' : ''}`}><div className="flex space-x-2"><div className="w-3.5 h-3.5 bg-red-400 rounded-full" /><div className="w-3.5 h-3.5 bg-yellow-400 rounded-full" /><div className="w-3.5 h-3.5 bg-green-400 rounded-full" /></div><div className="bg-white px-5 py-2 rounded-xl text-[12px] text-gray-400 flex-1 flex items-center justify-between border border-gray-200"><span className="flex items-center space-x-2 font-medium tracking-tight"><Globe className="w-4 h-4 opacity-30" /><span>marketai.local/v/${salesPage.uuid}/${salesPage.product_name.toLowerCase().replace(/\s+/g, '-')}</span></span></div></div>
                                        <div className={`overflow-y-auto custom-scrollbar transition-all duration-1000 ${viewport === 'mobile' ? 'h-full rounded-[2.5rem]' : 'max-h-[1200px]'} ${salesPage.theme === 'corporate' || salesPage.theme === 'minimalist' ? 'bg-white text-slate-900' : salesPage.theme === 'dark_tech' ? 'bg-black text-green-400 font-mono' : salesPage.theme === 'vibrant' ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
                                            <div className={`max-w-5xl mx-auto text-center p-24 ${viewport === 'mobile' ? 'px-6 py-12 space-y-10' : 'space-y-16'}`}>
                                                <div className="group relative">
                                                    <h1 data-section="headline" onClick={(e) => handleTextClick(e, 'headline')} contentEditable suppressContentEditableWarning onBlur={(e) => handleBlur('headline', e.currentTarget.innerHTML)} className={`outline-none px-4 rounded-2xl hover:bg-indigo-500/5 transition-all cursor-text leading-[1.1] tracking-tight ${isMagicLoading && selectedSection === 'headline' ? 'animate-pulse-shimmer' : ''} ${viewport === 'mobile' ? 'text-3xl' : 'text-7xl'} ${salesPage.theme === 'corporate' || salesPage.theme === 'minimalist' ? 'font-serif text-slate-900' : salesPage.theme === 'dark_tech' ? 'font-black uppercase italic text-green-400' : salesPage.theme === 'vibrant' ? 'font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-indigo-400' : 'font-black text-slate-900'}`} dangerouslySetInnerHTML={{ __html: copy.headline }} />
                                                    <button onClick={() => handleRegenerate('headline')} className="absolute -right-12 top-0 p-3 opacity-0 group-hover:opacity-100 text-indigo-500 hover:bg-indigo-500/10 rounded-full transition-all"><RefreshCw className={`w-5 h-5 ${isRegenerating === 'headline' ? 'animate-spin' : ''}`} /></button>
                                                </div>
                                                <div className="group relative">
                                                    <p data-section="subheadline" onClick={(e) => handleTextClick(e, 'subheadline')} contentEditable suppressContentEditableWarning onBlur={(e) => handleBlur('subheadline', e.currentTarget.innerHTML)} className={`outline-none px-4 rounded-2xl max-w-3xl mx-auto transition-all cursor-text leading-relaxed ${isMagicLoading && selectedSection === 'subheadline' ? 'animate-pulse-shimmer' : ''} ${viewport === 'mobile' ? 'text-lg' : 'text-2xl'} ${salesPage.theme === 'corporate' || salesPage.theme === 'minimalist' ? 'text-slate-600 font-medium italic' : salesPage.theme === 'dark_tech' ? 'text-green-500/90 font-mono' : 'text-slate-600 font-medium'}`} dangerouslySetInnerHTML={{ __html: copy.subheadline }} />
                                                    <button onClick={() => handleRegenerate('subheadline')} className="absolute -right-12 top-0 p-3 opacity-0 group-hover:opacity-100 text-indigo-500 hover:bg-indigo-500/10 rounded-full transition-all"><RefreshCw className={`w-5 h-5 ${isRegenerating === 'subheadline' ? 'animate-spin' : ''}`} /></button>
                                                </div>
                                                <div className="group relative w-full aspect-video rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white/10 transform transition-all hover:scale-[1.01] bg-white/5 backdrop-blur-sm">
                                                    {/* Image Magic Toolbar */}
                                                    <div className="absolute top-6 left-1/2 -translate-x-1/2 flex items-center space-x-2 bg-black/60 backdrop-blur-xl border border-white/10 p-2 rounded-2xl opacity-0 group-hover:opacity-100 transition-all z-10 scale-90 group-hover:scale-100">
                                                        <div className="flex items-center bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 mr-2">
                                                            <ImageIcon className="w-3.5 h-3.5 text-gray-500 mr-2" />
                                                            <input 
                                                                type="text" 
                                                                defaultValue={copy.image_keyword || ''}
                                                                onBlur={(e) => handleUpdateImageKeyword(e.target.value)}
                                                                onKeyDown={(e) => e.key === 'Enter' && handleUpdateImageKeyword((e.target as HTMLInputElement).value)}
                                                                className="bg-transparent border-none text-[10px] font-bold text-white outline-none w-32 placeholder:text-gray-600"
                                                                placeholder="Image keyword..."
                                                            />
                                                        </div>
                                                        <button onClick={() => handleImageFilter('grayscale')} className={`p-3 rounded-xl transition-all ${salesPage.settings?.image_filters?.grayscale ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white hover:bg-white/10'}`} title="Grayscale"><ImageIcon className="w-4 h-4" /></button>
                                                        <button onClick={() => handleImageFilter('invert')} className={`p-3 rounded-xl transition-all ${salesPage.settings?.image_filters?.invert ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white hover:bg-white/10'}`} title="Invert Colors"><Zap className="w-4 h-4" /></button>
                                                        <button onClick={() => handleImageFilter('sepia')} className={`p-3 rounded-xl transition-all ${salesPage.settings?.image_filters?.sepia ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white hover:bg-white/10'}`} title="Sepia Mood"><Palette className="w-4 h-4" /></button>
                                                        <div className="h-6 w-px bg-white/10 mx-1" />
                                                        <button onClick={() => handleRegenerateImage()} className="p-3 rounded-xl text-indigo-400 hover:bg-indigo-500/10 transition-all" title="New AI Image"><RefreshCw className="w-4 h-4" /></button>
                                                    </div>

                                                    <img 
                                                        src={heroImage} 
                                                        alt="Magic Hero" 
                                                        referrerPolicy="no-referrer"
                                                        className={`w-full h-full object-cover transition-all duration-700 ${salesPage.settings?.image_filters?.grayscale ? 'grayscale' : ''} ${salesPage.settings?.image_filters?.invert ? 'invert' : ''} ${salesPage.settings?.image_filters?.sepia ? 'sepia' : ''} ${salesPage.theme === 'dark_tech' && !salesPage.settings?.image_filters ? 'grayscale invert brightness-50 contrast-150' : ''}`}
                                                        onError={(e) => {
                                                            e.currentTarget.onerror = null;
                                                            e.currentTarget.src = getFallbackImage();
                                                        }}
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
                                                <section className={`${viewport === 'mobile' ? 'py-16' : 'py-32'} ${salesPage.theme === 'corporate' || salesPage.theme === 'minimalist' ? 'border-slate-100' : salesPage.theme === 'dark_tech' ? 'border-green-500/20' : 'border-white/10'}`}>
                                                    <div className={`grid gap-20 text-left ${viewport === 'mobile' ? 'grid-cols-1 gap-12' : 'grid-cols-2'}`}>
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
                                                </section>

                                                {/* Benefits Grid */}
                                                <section className={`${viewport === 'mobile' ? 'py-16' : 'py-32'} px-6 max-w-6xl mx-auto`}>
                                                    <div className={`grid gap-12 md:gap-20 text-left ${viewport === 'mobile' ? 'grid-cols-1' : 'md:grid-cols-2'}`}>
                                                        {copy.benefits.map((benefit: string, i: number) => (
                                                            <div key={i} className="flex flex-row items-start space-x-6 md:space-x-10 group/benefit relative">
                                                                <div className={`flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-2xl md:rounded-[2.5rem] flex items-center justify-center text-white text-xl md:text-2xl font-black shadow-xl ${salesPage.theme === 'dark_tech' ? 'bg-green-600 shadow-green-500/20' : 'bg-indigo-600 shadow-indigo-500/20'}`}>
                                                                    {benefit.charAt(0)}
                                                                </div>
                                                                <div className="space-y-3">
                                                                    <h4 className="text-xl md:text-2xl font-black tracking-tight">{benefit.split(' ').slice(0, 3).join(' ')}</h4>
                                                                    <p 
                                                                        data-section={`benefits.${i}`}
                                                                        contentEditable 
                                                                        suppressContentEditableWarning 
                                                                        onBlur={(e) => handleBlur(`benefits.${i}`, e.currentTarget.innerText)}
                                                                        onClick={(e) => handleTextClick(e, `benefits.${i}`)}
                                                                        className={`opacity-60 leading-relaxed text-base md:text-lg outline-none cursor-text hover:bg-indigo-500/5 rounded-xl transition-all ${isMagicLoading && selectedSection === `benefits.${i}` ? 'animate-pulse-shimmer' : ''}`}
                                                                    >
                                                                        {benefit}
                                                                    </p>
                                                                </div>
                                                                <button onClick={() => {
                                                                    const newBenefits = [...copy.benefits];
                                                                    newBenefits.splice(i, 1);
                                                                    handleUpdateContent('benefits', newBenefits);
                                                                }} className="absolute -left-12 top-0 p-3 opacity-0 group-hover/benefit:opacity-100 text-red-500 hover:bg-red-500/10 rounded-full transition-all no-print"><X className="w-4 h-4" /></button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </section>

                                                {/* Features Breakdown */}
                                                <section className={`${viewport === 'mobile' ? 'py-16' : 'py-32'} ${isCorporate || isMinimal ? 'bg-slate-50' : 'bg-white/5'}`}>
                                                    <div className={`grid gap-16 text-left ${viewport === 'mobile' ? 'grid-cols-1' : 'md:grid-cols-2'}`}>
                                                        {copy.features_breakdown.map((f: any, i: number) => (
                                                            <div key={i} className="flex space-x-8 group/feature relative">
                                                                <div className={`flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center text-white text-xl font-black shadow-xl ${salesPage.theme === 'dark_tech' ? 'bg-green-600 shadow-green-500/20' : 'bg-indigo-600 shadow-indigo-600/20'}`}>
                                                                    {f.title.charAt(0)}
                                                                </div>
                                                                <div className="space-y-3">
                                                                    <h4 
                                                                        data-section={`features_breakdown.${i}.title`}
                                                                        contentEditable 
                                                                        suppressContentEditableWarning 
                                                                        onBlur={(e) => handleBlur(`features_breakdown.${i}.title`, e.currentTarget.innerText)}
                                                                        onClick={(e) => handleTextClick(e, `features_breakdown.${i}.title`)}
                                                                        className={`text-2xl font-bold outline-none cursor-text hover:bg-indigo-500/5 rounded-xl transition-all ${isMagicLoading && selectedSection === `features_breakdown.${i}.title` ? 'animate-pulse-shimmer' : ''}`}
                                                                    >
                                                                        {f.title}
                                                                    </h4>
                                                                    <p 
                                                                        data-section={`features_breakdown.${i}.description`}
                                                                        contentEditable 
                                                                        suppressContentEditableWarning 
                                                                        onBlur={(e) => handleBlur(`features_breakdown.${i}.description`, e.currentTarget.innerText)}
                                                                        onClick={(e) => handleTextClick(e, `features_breakdown.${i}.description`)}
                                                                        className={`opacity-60 leading-relaxed text-lg outline-none cursor-text hover:bg-indigo-500/5 rounded-xl transition-all ${isMagicLoading && selectedSection === `features_breakdown.${i}.description` ? 'animate-pulse-shimmer' : ''}`}
                                                                    >
                                                                        {f.description}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </section>

                                                {/* Testimonials Section */}
                                                {salesPage.settings?.visible_sections?.testimonials && (
                                                    <div className={`${viewport === 'mobile' ? 'pt-12' : 'pt-24'}`}>
                                                        <h3 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-12 text-center ${salesPage.theme === 'dark_tech' ? 'text-green-500' : 'text-gray-400'}`}>What People Say</h3>
                                                        
                                                        {isRegenerating === 'testimonials' ? (
                                                            <div className={`grid gap-8 ${viewport === 'mobile' ? 'grid-cols-1' : 'md:grid-cols-3'}`}>
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
                                                            <div className={`grid gap-8 ${viewport === 'mobile' ? 'grid-cols-1' : 'md:grid-cols-3'}`}>
                                                                {copy.testimonials.map((t: any, i: number) => (
                                                                    <div key={i} className={`p-8 rounded-3xl border group/card hover:scale-105 transition-all ${salesPage.theme === 'dark_tech' ? 'bg-white/5 border-green-500/20 text-green-400' : 'bg-white border-slate-100 shadow-sm'}`}>
                                                                        <p 
                                                                            data-section={`testimonials.${i}.content`}
                                                                            contentEditable 
                                                                            suppressContentEditableWarning 
                                                                            onBlur={(e) => handleBlur(`testimonials.${i}.content`, e.currentTarget.innerText)}
                                                                            onClick={(e) => handleTextClick(e, `testimonials.${i}.content`)}
                                                                            className={`italic mb-6 outline-none cursor-text hover:bg-indigo-500/5 rounded-xl transition-all ${isMagicLoading && selectedSection === `testimonials.${i}.content` ? 'animate-pulse-shimmer' : ''}`}
                                                                        >
                                                                            "{t.content}"
                                                                        </p>
                                                                        <div className="flex items-center space-x-3">
                                                                            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">{t.name[0]}</div>
                                                                            <div>
                                                                                <div 
                                                                                    data-section={`testimonials.${i}.name`}
                                                                                    contentEditable 
                                                                                    suppressContentEditableWarning 
                                                                                    onBlur={(e) => handleBlur(`testimonials.${i}.name`, e.currentTarget.innerText)}
                                                                                    onClick={(e) => handleTextClick(e, `testimonials.${i}.name`)}
                                                                                    className="font-bold text-sm outline-none cursor-text hover:bg-indigo-500/5 rounded-lg px-1 transition-all"
                                                                                >
                                                                                    {t.name}
                                                                                </div>
                                                                                <div 
                                                                                    data-section={`testimonials.${i}.role`}
                                                                                    contentEditable 
                                                                                    suppressContentEditableWarning 
                                                                                    onBlur={(e) => handleBlur(`testimonials.${i}.role`, e.currentTarget.innerText)}
                                                                                    onClick={(e) => handleTextClick(e, `testimonials.${i}.role`)}
                                                                                    className="text-[10px] opacity-50 uppercase tracking-wider outline-none cursor-text hover:bg-indigo-500/5 rounded-lg px-1 transition-all"
                                                                                >
                                                                                    {t.role}
                                                                                </div>
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
                                                    <div className={`${viewport === 'mobile' ? 'pt-16' : 'pt-32'} text-left max-w-3xl mx-auto px-6`}>
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
                                                                            <span 
                                                                                data-section={`faq.${i}.question`}
                                                                                contentEditable 
                                                                                suppressContentEditableWarning 
                                                                                onBlur={(e) => handleBlur(`faq.${i}.question`, e.currentTarget.innerText)}
                                                                                onClick={(e) => handleTextClick(e, `faq.${i}.question`)}
                                                                                className={`outline-none cursor-text hover:bg-indigo-500/5 rounded-lg px-1 transition-all ${salesPage.theme === 'dark_tech' ? 'text-green-400' : 'text-slate-900'} ${isMagicLoading && selectedSection === `faq.${i}.question` ? 'animate-pulse-shimmer' : ''}`}
                                                                            >
                                                                                {f.question}
                                                                            </span>
                                                                        </div>
                                                                        <div 
                                                                            data-section={`faq.${i}.answer`}
                                                                            contentEditable 
                                                                            suppressContentEditableWarning 
                                                                            onBlur={(e) => handleBlur(`faq.${i}.answer`, e.currentTarget.innerText)}
                                                                            onClick={(e) => handleTextClick(e, `faq.${i}.answer`)}
                                                                            className={`opacity-60 text-sm leading-relaxed outline-none cursor-text hover:bg-indigo-500/5 rounded-lg px-1 transition-all ${isMagicLoading && selectedSection === `faq.${i}.answer` ? 'animate-pulse-shimmer' : ''}`}
                                                                        >
                                                                            {f.answer}
                                                                        </div>
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
                                                    <div className={`rounded-[2.5rem] md:rounded-[4rem] p-10 md:p-24 shadow-2xl relative overflow-hidden group transition-all ${salesPage.theme === 'minimalist' ? 'bg-slate-900 text-white' : salesPage.theme === 'corporate' ? 'bg-blue-950 text-white' : salesPage.theme === 'dark_tech' ? 'bg-black border-4 border-green-500 text-green-500' : 'bg-indigo-950 text-white shadow-indigo-500/10'}`}>
                                                        <h2 className={`font-bold mb-10 ${viewport === 'mobile' ? 'text-2xl' : 'text-4xl'}`}>Start Your Journey</h2>
                                                        <div data-section="pricing_display" onClick={(e) => handleTextClick(e, 'pricing_display')} contentEditable suppressContentEditableWarning onBlur={(e) => handleBlur('pricing_display', e.currentTarget.innerHTML)} className={`font-black mb-12 tracking-tighter outline-none cursor-text ${isMagicLoading && selectedSection === 'pricing_display' ? 'animate-pulse-shimmer' : ''} ${viewport === 'mobile' ? 'text-6xl' : 'text-9xl'}`} dangerouslySetInnerHTML={{ __html: copy.pricing_display }} />
                                                        <p data-section="social_proof_placeholder" onClick={(e) => handleTextClick(e, 'social_proof_placeholder')} contentEditable suppressContentEditableWarning onBlur={(e) => handleBlur('social_proof_placeholder', e.currentTarget.innerHTML)} className={`text-xl opacity-60 mb-16 max-w-lg mx-auto outline-none cursor-text leading-relaxed ${isMagicLoading && selectedSection === 'social_proof_placeholder' ? 'animate-pulse-shimmer' : ''} ${viewport === 'mobile' ? 'text-lg' : 'text-xl'}`} dangerouslySetInnerHTML={{ __html: copy.social_proof_placeholder }} />
                                                        <button className={`px-16 py-7 rounded-full font-black text-2xl transition-all transform hover:scale-110 active:scale-95 bg-white ${salesPage.theme === 'dark_tech' ? 'text-black' : 'text-indigo-900'} ${viewport === 'mobile' ? 'text-xl' : 'text-2xl'}`}>{copy.cta}</button>
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
                        rgba(99, 102, 241, 0.4) 50%, 
                        rgba(99, 102, 241, 0.1) 75%
                    );
                    background-size: 200% 100%;
                    animation: shimmer 1.5s infinite;
                    border-radius: 0.8rem;
                    color: transparent !important;
                    position: relative;
                }
                
                .animate-pulse-shimmer::after {
                    content: '';
                    position: absolute;
                    inset: 0;
                    border: 2px solid rgba(99, 102, 241, 0.3);
                    border-radius: inherit;
                    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }
                
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: .5; }
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
