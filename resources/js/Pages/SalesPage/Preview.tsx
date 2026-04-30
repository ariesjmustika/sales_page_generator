import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import {
    AlertTriangle,
    ArrowLeft,
    Copy,
    Crown,
    Download,
    FileText,
    Globe,
    HelpCircle,
    Image as ImageIcon,
    Layout,
    MessageSquare,
    Palette,
    RefreshCw,
    Save,
    Smartphone,
    Signal,
    Wifi,
    Battery,
    Trash2,
    X,
    Zap,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast, Toaster } from 'sonner';

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
            features_breakdown: Array<{ title: string; description: string }>;
            social_proof_placeholder: string;
            pricing_display: string;
            cta: string;
            image_keyword?: string;
            faq?: Array<{ question: string; answer: string }>;
            testimonials?: Array<{
                name: string;
                role: string;
                content: string;
            }>;
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
    const [activeTab, setActiveTab] = useState<
        'preview' | 'content' | 'conversion'
    >('preview');
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
    const magicPrompt =
        `${salesPage.product_name} ${salesPage.image_style} ${copy.image_keyword || ''}`.slice(
            0,
            100,
        );
    const heroImage = `https://image.pollinations.ai/prompt/${encodeURIComponent(magicPrompt)}?width=1200&height=800&nologo=true&seed=${salesPage.image_seed}`;

    // Smart Fallback Logic: Ultra-Reliable Static IDs from Unsplash CDN
    const getFallbackImage = () => {
        const text = (
            salesPage.product_name +
            ' ' +
            (copy.image_keyword || '')
        ).toLowerCase();
        // Coffee Niche
        if (
            text.includes('coffee') ||
            text.includes('brew') ||
            text.includes('cafe')
        )
            return 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80';
        // Tech / AI Niche
        if (
            text.includes('tech') ||
            text.includes('ai') ||
            text.includes('software') ||
            text.includes('security')
        )
            return 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80';
        // Gaming / Chair Niche
        if (
            text.includes('chair') ||
            text.includes('gaming') ||
            text.includes('furniture')
        )
            return 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&w=1200&q=80';
        // Fashion / Sneakers Niche
        if (
            text.includes('sneaker') ||
            text.includes('shoes') ||
            text.includes('fashion') ||
            text.includes('urban')
        )
            return 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80';
        // Gadget / Mirror / Beauty Niche
        if (
            text.includes('mirror') ||
            text.includes('gadget') ||
            text.includes('beauty') ||
            text.includes('influencer')
        )
            return 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80';

        return `https://picsum.photos/seed/${salesPage.uuid}/1200/800`;
    };

    useEffect(() => {
        setCopy(salesPage.generated_copy);
    }, [salesPage.generated_copy]);

    const handleUpdateContent = (path: string, value: any) => {
        const newCopy = JSON.parse(JSON.stringify(copy));
        const parts = path.split('.');
        let current: any = newCopy;

        for (let i = 0; i < parts.length - 1; i++) {
            current = current[parts[i]];
        }
        current[parts[parts.length - 1]] = value;

        setCopy(newCopy);
        saveManualEdit(newCopy);
    };

    const saveManualEdit = (updatedCopy: any) => {
        setIsSaving(true);
        router.post(
            route('sales-pages.update-copy', salesPage.uuid),
            {
                generated_copy: updatedCopy,
            },
            {
                preserveScroll: true,
                onSuccess: () => setIsSaving(false),
                onFinish: () => setIsSaving(false),
            },
        );
    };

    const handleRegenerate = (section: string) => {
        setIsRegenerating(section);
        router.post(
            route('sales-pages.regenerate', salesPage.uuid),
            {
                section: section,
            },
            {
                onSuccess: () => {
                    toast.success(`${section} regenerated!`);
                    setIsRegenerating(null);
                },
                onError: () => setIsRegenerating(null),
            },
        );
    };

    const handleUpdateTheme = (theme: string) => {
        router.post(
            route('sales-pages.update-theme', salesPage.uuid),
            {
                theme: theme,
            },
            {
                preserveScroll: true,
                onSuccess: () => toast.success(`Theme switched to ${theme}!`),
            },
        );
    };

    const handleUpdateImageStyle = (style: string) => {
        router.post(
            route('sales-pages.image-style', salesPage.uuid),
            {
                image_style: style,
            },
            {
                preserveScroll: true,
                onSuccess: () => toast.success(`Image style set to ${style}!`),
            },
        );
    };

    const handleRegenerateImage = () => {
        router.post(
            route('sales-pages.regenerate-image', salesPage.uuid),
            {},
            {
                preserveScroll: true,
                onSuccess: () => toast.success('New image generated!'),
            },
        );
    };

    const handleDelete = () => {
        router.delete(route('sales-pages.destroy', salesPage.uuid), {
            onFinish: () => {
                setShowDeleteModal(false);
            },
        });
    };

    // Responsive Sidebar State
    const [showSidebar, setShowSidebar] = useState(false);

    // Magic Toolbar State
    const [toolbarPos, setToolbarPos] = useState<{
        top: number;
        left: number;
    } | null>(null);
    const [selectedSection, setSelectedSection] = useState<string | null>(null);
    const [selectedText, setSelectedText] = useState('');
    const [isMagicLoading, setIsMagicLoading] = useState(false);

    const handleImageFilter = (filter: string) => {
        const currentFilters = salesPage.settings?.image_filters || {
            grayscale: false,
            invert: false,
            sepia: false,
        };
        const newFilters = {
            ...currentFilters,
            [filter]: !currentFilters[filter as keyof typeof currentFilters],
        };

        const newSettings = {
            ...salesPage.settings,
            image_filters: newFilters,
        };
        router.post(
            route('sales-pages.update-settings', salesPage.uuid),
            { settings: newSettings },
            { preserveScroll: true },
        );
        toast.success(`Image filter updated!`);
    };

    const handleTextClick = (e: React.MouseEvent, section: string) => {
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        setToolbarPos({
            top: rect.top + window.scrollY - 60,
            left: rect.left + rect.width / 2,
        });
        setSelectedSection(section);
        setSelectedText((e.currentTarget as HTMLElement).innerText);
    };

    const handleMagicRewrite = (action: string) => {
        if (!selectedSection || !selectedText) return;

        setIsMagicLoading(true);
        router.post(
            route('sales-pages.magic-rewrite', salesPage.uuid),
            {
                text: selectedText,
                action: action,
                section: selectedSection,
            },
            {
                preserveScroll: true,
                preserveState: true,
                onSuccess: (page) => {
                    // @ts-ignore
                    const newCopy = page.props.salesPage.generated_copy;
                    setCopy(newCopy);

                    // Manually force DOM update for contentEditable to avoid React's update-bailout
                    if (selectedSection) {
                        const el = document.querySelector(
                            `[data-section="${selectedSection}"]`,
                        );
                        if (el) {
                            // Resolve value from potentially nested key path (e.g. "benefits.0")
                            let val: any = newCopy;
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
                onError: (errors) => {
                    toast.error(
                        'AI is a bit busy right now. Please wait a minute and try again!',
                    );
                },
                onFinish: () => {
                    setIsMagicLoading(false);
                    setSelectedSection(null);
                },
            },
        );
    };

    const handleBlur = (section: string, text: string) => {
        // Prevent manual save if AI is processing or if the toolbar is open (to avoid race conditions)
        if (isMagicLoading || toolbarPos) return;

        // Resolve current value from potentially nested key path for comparison
        let currentVal: any = copy;
        const parts = section.split('.');
        for (const part of parts) {
            currentVal = currentVal?.[part];
        }

        const cleanText = text.trim();
        if (cleanText === (currentVal as string)) return; // No change, no save

        handleUpdateContent(section, cleanText);
    };

    const handleUpdateImageKeyword = (keyword: string) => {
        const newCopy = { ...copy, image_keyword: keyword };
        setCopy(newCopy);
        saveManualEdit(newCopy);
        toast.success(`Visual concept updated!`);
    };

    // Conversion States (Local for Debounce)
    const [waNumber, setWaNumber] = useState(
        salesPage.settings?.whatsapp_number || '',
    );
    const [waMessage, setWaMessage] = useState(
        salesPage.settings?.whatsapp_message || '',
    );

    useEffect(() => {
        const timer = setTimeout(() => {
            if (
                waNumber !== (salesPage.settings?.whatsapp_number || '') ||
                waMessage !== (salesPage.settings?.whatsapp_message || '')
            ) {
                const newSettings = {
                    ...salesPage.settings,
                    whatsapp_number: waNumber,
                    whatsapp_message: waMessage,
                };
                router.post(
                    route('sales-pages.update-settings', salesPage.uuid),
                    { settings: newSettings },
                    {
                        preserveScroll: true,
                        preserveState: true,
                    },
                );
            }
        }, 800);

        return () => clearTimeout(timer);
    }, [waNumber, waMessage]);

    const formatText = (command: string) => {
        document.execCommand(command, false, undefined);
        // Trigger save after formatting
        if (selectedSection) {
            const el = document.querySelector(
                `[data-section="${selectedSection}"]`,
            );
            if (el)
                handleUpdateContent(
                    selectedSection,
                    (el as HTMLElement).innerText,
                );
        }
    };

    const downloadHtml = () => {
        const t = salesPage.theme;
        const isVibrant = t === 'vibrant';
        const isCorporate = t === 'corporate';
        const isDarkTech = t === 'dark_tech';
        const isMinimal = t === 'minimalist';

        const waNumberFormatted = salesPage.settings?.whatsapp_number?.replace(
            /\D/g,
            '',
        );
        const waMessageEncoded = encodeURIComponent(
            salesPage.settings?.whatsapp_message || '',
        );
        const waLink = waNumberFormatted
            ? `https://wa.me/${waNumberFormatted}?text=${waMessageEncoded}`
            : '#';

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
            ${copy.benefits
                .map(
                    (benefit) => `
                <div class="p-12 rounded-[3.5rem] transition-all ${isCorporate || isMinimal ? 'bg-white border border-slate-100 shadow-xl shadow-slate-200/50' : 'glass'}">
                    <div class="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-8 text-indigo-400">
                        <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
                    </div>
                    <p class="text-xl font-bold leading-snug">${benefit}</p>
                </div>
            `,
                )
                .join('')}
        </div>
    </section>

    <!-- Features Breakdown -->
    <section class="py-40 ${isCorporate || isMinimal ? 'bg-slate-50' : 'bg-white/5'}">
        <div class="max-w-7xl mx-auto px-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-20 text-left">
                ${copy.features_breakdown
                    .map(
                        (f) => `
                    <div class="flex space-x-10 group">
                        <div class="flex-shrink-0 w-20 h-20 rounded-[2rem] flex items-center justify-center text-white text-2xl font-black shadow-2xl ${isDarkTech ? 'bg-green-600 shadow-green-500/30' : 'bg-indigo-600 shadow-indigo-600/30'}">
                            ${f.title.charAt(0)}
                        </div>
                        <div class="space-y-4">
                            <h4 class="text-3xl font-black tracking-tight">${f.title}</h4>
                            <p class="text-lg opacity-60 leading-relaxed">${f.description}</p>
                        </div>
                    </div>
                `,
                    )
                    .join('')}
            </div>
        </div>
    </section>

    ${
        copy.testimonials &&
        (salesPage.settings?.visible_sections?.testimonials ?? true)
            ? `
    <!-- Testimonials -->
    <section class="py-40 px-6 max-w-7xl mx-auto">
        <h3 class="text-xs font-black uppercase tracking-[0.4em] mb-20 text-center opacity-40">What People Say</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-10">
            ${copy.testimonials
                .map(
                    (t) => `
                <div class="p-12 rounded-[4rem] transition-all ${isDarkTech ? 'glass-dark text-green-400' : 'bg-white border border-slate-100 shadow-2xl shadow-slate-200/40'}">
                    <p class="text-xl italic mb-10 opacity-80 leading-relaxed">"${t.content}"</p>
                    <div class="flex items-center space-x-5">
                        <div class="w-14 h-14 rounded-full bg-indigo-500/10 flex items-center justify-center font-bold text-indigo-500 text-xl">${t.name.charAt(0)}</div>
                        <div><div class="font-bold text-lg">${t.name}</div><div class="text-xs opacity-50 uppercase tracking-widest font-black">${t.role}</div></div>
                    </div>
                </div>
            `,
                )
                .join('')}
        </div>
    </section>
    `
            : ''
    }

    ${
        copy.faq && (salesPage.settings?.visible_sections?.faq ?? true)
            ? `
    <!-- FAQ Section -->
    <section class="py-40 px-6 max-w-4xl mx-auto text-left">
        <h3 class="text-xs font-black uppercase tracking-[0.4em] mb-20 text-center opacity-40">Common Questions</h3>
        <div class="space-y-8">
            ${copy.faq
                .map(
                    (f) => `
                <div class="p-10 rounded-[3rem] ${isDarkTech ? 'glass-dark' : 'bg-white border border-slate-50 shadow-xl shadow-slate-100'}">
                    <h4 class="font-black text-2xl mb-5 text-indigo-500 flex items-center space-x-4">
                        <span class="opacity-30">Q:</span>
                        <span class="${isDarkTech ? 'text-green-400' : 'text-slate-900'}">${f.question}</span>
                    </h4>
                    <p class="text-lg opacity-60 leading-relaxed ml-12">${f.answer}</p>
                </div>
            `,
                )
                .join('')}
        </div>
    </section>
    `
            : ''
    }

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
        const a = document.createElement('a');
        a.href = url;
        a.download = `${salesPage.product_name.toLowerCase().replace(/\s+/g, '-')}-sales-page.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
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
                        <Link
                            href={route('dashboard')}
                            className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-white/10"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                        <div>
                            <h2 className="text-xl font-bold leading-tight text-white">
                                {salesPage.product_name}
                            </h2>
                            <div className="flex items-center space-x-2">
                                <p className="text-xs text-gray-500">
                                    Draft saved{' '}
                                    {new Date(
                                        salesPage.created_at,
                                    ).toLocaleDateString()}
                                </p>
                                {isSaving && (
                                    <span className="flex animate-pulse items-center space-x-1 text-[10px] text-indigo-400">
                                        <Save className="h-3 w-3" />
                                        <span>Saving...</span>
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={() => setShowDeleteModal(true)}
                            className="rounded-xl p-2.5 text-gray-500 transition-all hover:bg-red-500/10 hover:text-red-500"
                            title="Delete Page"
                        >
                            <Trash2 className="h-5 w-5" />
                        </button>
                        <button
                            onClick={() => {
                                const url = `${window.location.origin}/v/${salesPage.uuid}`;
                                navigator.clipboard.writeText(url);
                                toast.success('Public link copied!');
                            }}
                            className="flex items-center space-x-2 rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-bold text-white shadow-lg transition-all hover:bg-white/10"
                        >
                            <Copy className="h-4 w-4" />
                            <span>Share Link</span>
                        </button>
                        <button
                            onClick={() => window.print()}
                            className="flex items-center space-x-2 rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-bold text-white shadow-lg transition-all hover:bg-white/10"
                        >
                            <FileText className="h-4 w-4" />
                            <span>PDF</span>
                        </button>
                        <button
                            onClick={downloadHtml}
                            className="flex items-center space-x-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg transition-all hover:bg-indigo-700"
                        >
                            <Download className="h-4 w-4" />
                            <span>Export Site</span>
                        </button>
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
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowDeleteModal(false)}
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
                                    onClick={() => setShowDeleteModal(false)}
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
                            transform: 'translateX(-50%)',
                        }}
                        className="z-[100] flex items-center space-x-1 rounded-2xl border border-white/10 bg-[#1a1a24]/90 p-1.5 shadow-2xl backdrop-blur-xl"
                    >
                        <div className="mr-1 flex items-center border-r border-white/5 pr-1">
                            <button
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={() => formatText('bold')}
                                className="rounded-xl p-2 text-gray-300 transition-all hover:bg-white/10"
                                title="Bold"
                            >
                                <span className="font-bold">B</span>
                            </button>
                            <button
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={() => formatText('italic')}
                                className="rounded-xl p-2 text-gray-300 transition-all hover:bg-white/10"
                                title="Italic"
                            >
                                <span className="italic">I</span>
                            </button>
                        </div>

                        <div className="flex items-center space-x-1">
                            <button
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={() => handleMagicRewrite('shorten')}
                                disabled={isMagicLoading}
                                className="rounded-xl px-3 py-2 text-[10px] font-black uppercase tracking-widest text-indigo-400 transition-all hover:bg-indigo-500/20 disabled:opacity-50"
                            >
                                {isMagicLoading ? '...' : 'Shorten'}
                            </button>
                            <button
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={() => handleMagicRewrite('persuasive')}
                                disabled={isMagicLoading}
                                className="rounded-xl px-3 py-2 text-[10px] font-black uppercase tracking-widest text-indigo-400 transition-all hover:bg-indigo-500/20 disabled:opacity-50"
                            >
                                Persuasive
                            </button>
                            <button
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={() => handleMagicRewrite('witty')}
                                disabled={isMagicLoading}
                                className="rounded-xl px-3 py-2 text-[10px] font-black uppercase tracking-widest text-indigo-400 transition-all hover:bg-indigo-500/20 disabled:opacity-50"
                            >
                                Witty
                            </button>
                            <button
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={() =>
                                    handleMagicRewrite('professional')
                                }
                                disabled={isMagicLoading}
                                className="rounded-xl px-3 py-2 text-[10px] font-black uppercase tracking-widest text-indigo-400 transition-all hover:bg-indigo-500/20 disabled:opacity-50"
                            >
                                Pro
                            </button>
                        </div>
                        <button
                            onClick={() => setToolbarPos(null)}
                            className="rounded-xl p-2 text-gray-500 transition-all hover:bg-red-500/10 hover:text-red-400"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="min-h-screen bg-[#0a0a0c] py-8">
                <div className="max-[1600px] mx-auto sm:px-6 lg:px-8">
                    <div
                        className={`relative grid grid-cols-1 gap-8 lg:grid-cols-5`}
                    >
                        {/* Mobile Sticky Header */}
                        <div className="no-print sticky left-0 right-0 top-0 z-[110] flex items-center justify-between border-b border-white/10 bg-[#0a0a0c]/80 p-4 backdrop-blur-md lg:hidden">
                            <div className="flex items-center space-x-3">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
                                    <span className="text-sm font-bold text-white">
                                        M
                                    </span>
                                </div>
                                <span className="text-sm font-bold tracking-tight text-white">
                                    MarketAI Editor
                                </span>
                            </div>
                            <button
                                onClick={() => setShowSidebar(!showSidebar)}
                                className="flex items-center space-x-2 rounded-xl bg-indigo-600 px-4 py-2 text-white shadow-lg transition-transform active:scale-95"
                            >
                                <Layout className="h-4 w-4" />
                                <span className="text-xs font-bold uppercase tracking-widest">
                                    Menu
                                </span>
                            </button>
                        </div>

                        {/* Control Panel */}
                        <div
                            className={`no-print fixed inset-0 z-[200] space-y-6 bg-black/95 p-6 backdrop-blur-2xl transition-all duration-300 lg:relative lg:z-0 lg:col-span-1 lg:block lg:bg-transparent lg:p-0 lg:backdrop-blur-none ${showSidebar ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0 lg:translate-x-0 lg:opacity-100'}`}
                        >
                            <div className="custom-scrollbar sticky top-24 max-h-[calc(100vh-40px)] overflow-y-auto rounded-3xl border border-white/10 bg-[#121217] p-6 pb-20 lg:pb-6">
                                <div className="mb-8 flex items-center justify-between lg:hidden">
                                    <h2 className="text-xl font-bold tracking-tight text-white">
                                        Editor Controls
                                    </h2>
                                    <button
                                        onClick={() => setShowSidebar(false)}
                                        className="rounded-2xl bg-white/5 p-3 transition-transform active:scale-90"
                                    >
                                        <X className="h-6 w-6 text-gray-400" />
                                    </button>
                                </div>
                                <h3 className="mb-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
                                    Interface
                                </h3>
                                <div className="space-y-2">
                                    <button
                                        onClick={() => setActiveTab('preview')}
                                        className={`flex w-full items-center space-x-3 rounded-2xl px-4 py-3.5 transition-all ${activeTab === 'preview' ? 'border border-indigo-500/20 bg-indigo-500/10 text-indigo-400 shadow-inner' : 'text-gray-500 hover:bg-white/5'}`}
                                    >
                                        <Layout className="h-5 w-5" />
                                        <span className="text-sm font-bold">
                                            Visual Editor
                                        </span>
                                    </button>
                                    <button
                                        onClick={() =>
                                            setActiveTab('conversion')
                                        }
                                        className={`flex w-full items-center space-x-3 rounded-2xl px-4 py-3.5 transition-all ${activeTab === 'conversion' ? 'border border-indigo-500/20 bg-indigo-500/10 text-indigo-400 shadow-inner' : 'text-gray-500 hover:bg-white/5'}`}
                                    >
                                        <Zap className="h-5 w-5" />
                                        <span className="text-sm font-bold">
                                            Conversion
                                        </span>
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('content')}
                                        className={`flex w-full items-center space-x-3 rounded-2xl px-4 py-3.5 transition-all ${activeTab === 'content' ? 'border border-indigo-500/20 bg-indigo-500/10 text-indigo-400 shadow-inner' : 'text-gray-500 hover:bg-white/5'}`}
                                    >
                                        <Globe className="h-5 w-5" />
                                        <span className="text-sm font-bold">
                                            Raw Data
                                        </span>
                                    </button>
                                </div>

                                {activeTab === 'preview' && (
                                    <div className="mt-8 hidden border-t border-white/5 pt-8 lg:block">
                                        <h3 className="mb-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
                                            Viewport
                                        </h3>
                                        <div className="flex rounded-2xl border border-white/10 bg-white/5 p-1">
                                            <button
                                                onClick={() =>
                                                    setViewport('desktop')
                                                }
                                                className={`flex flex-1 items-center justify-center space-x-2 rounded-xl py-3 transition-all ${viewport === 'desktop' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
                                            >
                                                <Layout className="h-4 w-4" />
                                                <span className="text-xs font-bold">
                                                    Desktop
                                                </span>
                                            </button>
                                            <button
                                                onClick={() =>
                                                    setViewport('mobile')
                                                }
                                                className={`flex flex-1 items-center justify-center space-x-2 rounded-xl py-3 transition-all ${viewport === 'mobile' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
                                            >
                                                <Smartphone className="h-4 w-4" />
                                                <span className="text-xs font-bold">
                                                    Mobile
                                                </span>
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'preview' && (
                                    <div className="mt-8 border-t border-white/5 pt-8">
                                        <h3 className="mb-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
                                            Page Sections
                                        </h3>
                                        <div className="space-y-3">
                                            <div className="group flex items-center justify-between rounded-2xl border border-white/5 bg-white/[0.02] p-4 transition-all hover:border-indigo-500/30">
                                                <div className="flex items-center space-x-3">
                                                    <div className="rounded-lg bg-indigo-500/10 p-2 text-indigo-400">
                                                        <HelpCircle className="h-4 w-4" />
                                                    </div>
                                                    <span className="text-sm font-bold text-gray-300">
                                                        FAQ Section
                                                    </span>
                                                </div>
                                                <button
                                                    onClick={() => {
                                                        const visible =
                                                            salesPage.settings
                                                                ?.visible_sections ||
                                                            {};
                                                        const newSettings = {
                                                            ...salesPage.settings,
                                                            visible_sections: {
                                                                ...visible,
                                                                faq: !visible.faq,
                                                            },
                                                        };
                                                        router.post(
                                                            route(
                                                                'sales-pages.update-settings',
                                                                salesPage.uuid,
                                                            ),
                                                            {
                                                                settings:
                                                                    newSettings,
                                                            },
                                                            {
                                                                preserveScroll: true,
                                                            },
                                                        );
                                                    }}
                                                    className={`relative h-6 w-12 rounded-full transition-all ${salesPage.settings?.visible_sections?.faq ? 'bg-indigo-600' : 'bg-white/10'}`}
                                                >
                                                    <div
                                                        className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-all ${salesPage.settings?.visible_sections?.faq ? 'left-7' : 'left-1'}`}
                                                    />
                                                </button>
                                            </div>

                                            <div className="group flex items-center justify-between rounded-2xl border border-white/5 bg-white/[0.02] p-4 transition-all hover:border-indigo-500/30">
                                                <div className="flex items-center space-x-3">
                                                    <div className="rounded-lg bg-purple-500/10 p-2 text-purple-400">
                                                        <MessageSquare className="h-4 w-4" />
                                                    </div>
                                                    <span className="text-sm font-bold text-gray-300">
                                                        Testimonials
                                                    </span>
                                                </div>
                                                <button
                                                    onClick={() => {
                                                        const visible =
                                                            salesPage.settings
                                                                ?.visible_sections ||
                                                            {};
                                                        const newSettings = {
                                                            ...salesPage.settings,
                                                            visible_sections: {
                                                                ...visible,
                                                                testimonials:
                                                                    !visible.testimonials,
                                                            },
                                                        };
                                                        router.post(
                                                            route(
                                                                'sales-pages.update-settings',
                                                                salesPage.uuid,
                                                            ),
                                                            {
                                                                settings:
                                                                    newSettings,
                                                            },
                                                            {
                                                                preserveScroll: true,
                                                            },
                                                        );
                                                    }}
                                                    className={`relative h-6 w-12 rounded-full transition-all ${salesPage.settings?.visible_sections?.testimonials ? 'bg-purple-600' : 'bg-white/10'}`}
                                                >
                                                    <div
                                                        className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-all ${salesPage.settings?.visible_sections?.testimonials ? 'left-7' : 'left-1'}`}
                                                    />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="mt-8 border-t border-white/5 pt-8">
                                    <h3 className="mb-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
                                        Templates
                                    </h3>
                                    <div className="grid grid-cols-1 gap-2">
                                        {[
                                            {
                                                id: 'modern',
                                                name: 'Modern SaaS',
                                                icon: (
                                                    <Zap className="h-4 w-4" />
                                                ),
                                            },
                                            {
                                                id: 'corporate',
                                                name: 'Corporate Pro',
                                                icon: (
                                                    <Globe className="h-4 w-4" />
                                                ),
                                            },
                                            {
                                                id: 'vibrant',
                                                name: 'Vibrant Pulse',
                                                icon: (
                                                    <Palette className="h-4 w-4" />
                                                ),
                                            },
                                            {
                                                id: 'dark_tech',
                                                name: 'Dark Tech',
                                                icon: (
                                                    <ImageIcon className="h-4 w-4" />
                                                ),
                                            },
                                            {
                                                id: 'minimalist',
                                                name: 'Minimal Luxury',
                                                icon: (
                                                    <Crown className="h-4 w-4" />
                                                ),
                                            },
                                        ].map((t) => (
                                            <button
                                                key={t.id}
                                                onClick={() =>
                                                    handleUpdateTheme(t.id)
                                                }
                                                className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3.5 transition-all ${salesPage.theme === t.id ? 'border-indigo-500/50 bg-white/10 text-white' : 'border-transparent bg-white/5 text-gray-500 hover:bg-white/10'}`}
                                            >
                                                <div className="flex items-center space-x-3">
                                                    <span
                                                        className={`${salesPage.theme === t.id ? 'text-indigo-400' : 'text-gray-600'}`}
                                                    >
                                                        {t.icon}
                                                    </span>
                                                    <span className="text-xs font-bold">
                                                        {t.name}
                                                    </span>
                                                </div>
                                                {salesPage.theme === t.id && (
                                                    <div className="h-2 w-2 rounded-full bg-indigo-400" />
                                                )}
                                            </button>
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
                                        className={`printable-content relative mx-auto transition-all duration-500 ease-in-out ${viewport === 'mobile' ? 'h-auto max-w-[min(420px,100%)] bg-black lg:h-[880px] lg:rounded-[4.5rem] lg:border-[14px] lg:border-[#1a1a24] lg:ring-1 lg:ring-white/20 lg:shadow-[0_0_80px_-10px_rgba(99,102,241,0.2)]' : 'w-full border border-white/5 lg:rounded-[3rem]'}`}
                                    >
                                        {/* Realistic Mobile Shell Details */}
                                        {viewport === 'mobile' && (
                                            <>
                                                {/* Notch */}
                                                <div className="absolute top-0 left-1/2 z-[120] hidden h-7 w-40 -translate-x-1/2 rounded-b-3xl bg-[#1a1a24] lg:block"></div>

                                                {/* Status Bar */}
                                                <div className="absolute left-0 right-0 top-2 z-[115] hidden justify-between px-10 lg:flex">
                                                    <span className="text-[11px] font-bold text-gray-400">
                                                        9:41
                                                    </span>
                                                    <div className="flex items-center space-x-1.5 opacity-60">
                                                        <Signal className="h-3 w-3 text-gray-400" />
                                                        <Wifi className="h-3 w-3 text-gray-400" />
                                                        <Battery className="h-3.5 w-3.5 text-gray-400" />
                                                    </div>
                                                </div>

                                                {/* Internal Address Bar */}
                                                <div className="absolute left-0 right-0 top-10 z-[115] hidden px-8 lg:block">
                                                    <div className="flex items-center justify-center space-x-2 rounded-xl border border-white/5 bg-white/5 py-2 px-4 backdrop-blur-md">
                                                        <span className="truncate text-[9px] font-bold tracking-tight text-gray-500">
                                                            marketai.local/v/
                                                            {salesPage.uuid.slice(
                                                                0,
                                                                8,
                                                            )}
                                                            ...
                                                        </span>
                                                    </div>
                                                </div>
                                            </>
                                        )}

                                        <div
                                            className={`no-print flex items-center space-x-6 border-b border-gray-200 bg-gray-100 px-8 py-5 ${viewport === 'mobile' ? 'hidden' : ''}`}
                                        >
                                            <div className="flex space-x-2">
                                                <div className="h-3.5 w-3.5 rounded-full bg-red-400" />
                                                <div className="h-3.5 w-3.5 rounded-full bg-yellow-400" />
                                                <div className="h-3.5 w-3.5 rounded-full bg-green-400" />
                                            </div>
                                            <div className="flex flex-1 items-center justify-between rounded-xl border border-gray-200 bg-white px-5 py-2 text-[12px] text-gray-400">
                                                <span className="flex items-center space-x-2 font-medium tracking-tight">
                                                    <Globe className="h-4 w-4 opacity-30" />
                                                    <span>
                                                        marketai.local/v/$
                                                        {salesPage.uuid}/$
                                                        {salesPage.product_name
                                                            .toLowerCase()
                                                            .replace(
                                                                /\s+/g,
                                                                '-',
                                                            )}
                                                    </span>
                                                </span>
                                            </div>
                                        </div>
                                        <div
                                            className={`custom-scrollbar overflow-y-auto transition-all duration-1000 ${viewport === 'mobile' ? 'h-full rounded-[3.5rem] pt-20' : 'max-h-[1200px]'} ${salesPage.theme === 'corporate' || salesPage.theme === 'minimalist' ? 'bg-white text-slate-900' : salesPage.theme === 'dark_tech' ? 'bg-black font-mono text-green-400' : salesPage.theme === 'vibrant' ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}
                                        >
                                            <div
                                                className={`mx-auto max-w-5xl p-24 text-center ${viewport === 'mobile' ? 'space-y-10 px-6 py-12' : 'space-y-16'}`}
                                            >
                                                <div className="group relative">
                                                    <h1
                                                        data-section="headline"
                                                        onClick={(e) =>
                                                            handleTextClick(
                                                                e,
                                                                'headline',
                                                            )
                                                        }
                                                        contentEditable
                                                        suppressContentEditableWarning
                                                        onBlur={(e) =>
                                                            handleBlur(
                                                                'headline',
                                                                e.currentTarget
                                                                    .innerHTML,
                                                            )
                                                        }
                                                        className={`cursor-text rounded-2xl px-4 leading-[1.1] tracking-tight outline-none transition-all hover:bg-indigo-500/5 ${isMagicLoading && selectedSection === 'headline' ? 'animate-pulse-shimmer' : ''} ${viewport === 'mobile' ? 'text-3xl' : 'text-7xl'} ${salesPage.theme === 'corporate' || salesPage.theme === 'minimalist' ? 'font-serif text-slate-900' : salesPage.theme === 'dark_tech' ? 'font-black uppercase italic text-green-400' : salesPage.theme === 'vibrant' ? 'bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-indigo-400 bg-clip-text font-black text-transparent' : 'font-black text-slate-900'}`}
                                                        dangerouslySetInnerHTML={{
                                                            __html: copy.headline,
                                                        }}
                                                    />
                                                    <button
                                                        onClick={() =>
                                                            handleRegenerate(
                                                                'headline',
                                                            )
                                                        }
                                                        className="absolute -right-12 top-0 rounded-full p-3 text-indigo-500 opacity-0 transition-all hover:bg-indigo-500/10 group-hover:opacity-100"
                                                    >
                                                        <RefreshCw
                                                            className={`h-5 w-5 ${isRegenerating === 'headline' ? 'animate-spin' : ''}`}
                                                        />
                                                    </button>
                                                </div>
                                                <div className="group relative">
                                                    <p
                                                        data-section="subheadline"
                                                        onClick={(e) =>
                                                            handleTextClick(
                                                                e,
                                                                'subheadline',
                                                            )
                                                        }
                                                        contentEditable
                                                        suppressContentEditableWarning
                                                        onBlur={(e) =>
                                                            handleBlur(
                                                                'subheadline',
                                                                e.currentTarget
                                                                    .innerHTML,
                                                            )
                                                        }
                                                        className={`mx-auto max-w-3xl cursor-text rounded-2xl px-4 leading-relaxed outline-none transition-all ${isMagicLoading && selectedSection === 'subheadline' ? 'animate-pulse-shimmer' : ''} ${viewport === 'mobile' ? 'text-lg' : 'text-2xl'} ${salesPage.theme === 'corporate' || salesPage.theme === 'minimalist' ? 'font-medium italic text-slate-600' : salesPage.theme === 'dark_tech' ? 'font-mono text-green-500/90' : 'font-medium text-slate-600'}`}
                                                        dangerouslySetInnerHTML={{
                                                            __html: copy.subheadline,
                                                        }}
                                                    />
                                                    <button
                                                        onClick={() =>
                                                            handleRegenerate(
                                                                'subheadline',
                                                            )
                                                        }
                                                        className="absolute -right-12 top-0 rounded-full p-3 text-indigo-500 opacity-0 transition-all hover:bg-indigo-500/10 group-hover:opacity-100"
                                                    >
                                                        <RefreshCw
                                                            className={`h-5 w-5 ${isRegenerating === 'subheadline' ? 'animate-spin' : ''}`}
                                                        />
                                                    </button>
                                                </div>
                                                <div className="group relative aspect-video w-full transform overflow-hidden rounded-[3rem] border-4 border-white/10 bg-white/5 shadow-2xl backdrop-blur-sm transition-all hover:scale-[1.01]">
                                                    {/* Image Magic Toolbar */}
                                                    <div className="absolute left-1/2 top-6 z-10 flex -translate-x-1/2 scale-90 items-center space-x-2 rounded-2xl border border-white/10 bg-black/60 p-2 opacity-0 backdrop-blur-xl transition-all group-hover:scale-100 group-hover:opacity-100">
                                                        <div className="mr-2 flex items-center rounded-xl border border-white/10 bg-white/5 px-3 py-1.5">
                                                            <ImageIcon className="mr-2 h-3.5 w-3.5 text-gray-500" />
                                                            <input
                                                                type="text"
                                                                defaultValue={
                                                                    copy.image_keyword ||
                                                                    ''
                                                                }
                                                                onBlur={(e) =>
                                                                    handleUpdateImageKeyword(
                                                                        e.target
                                                                            .value,
                                                                    )
                                                                }
                                                                onKeyDown={(
                                                                    e,
                                                                ) =>
                                                                    e.key ===
                                                                        'Enter' &&
                                                                    handleUpdateImageKeyword(
                                                                        (
                                                                            e.target as HTMLInputElement
                                                                        ).value,
                                                                    )
                                                                }
                                                                className="w-32 border-none bg-transparent text-[10px] font-bold text-white outline-none placeholder:text-gray-600"
                                                                placeholder="Image keyword..."
                                                            />
                                                        </div>
                                                        <button
                                                            onClick={() =>
                                                                handleImageFilter(
                                                                    'grayscale',
                                                                )
                                                            }
                                                            className={`rounded-xl p-3 transition-all ${salesPage.settings?.image_filters?.grayscale ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-white/10 hover:text-white'}`}
                                                            title="Grayscale"
                                                        >
                                                            <ImageIcon className="h-4 w-4" />
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                handleImageFilter(
                                                                    'invert',
                                                                )
                                                            }
                                                            className={`rounded-xl p-3 transition-all ${salesPage.settings?.image_filters?.invert ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-white/10 hover:text-white'}`}
                                                            title="Invert Colors"
                                                        >
                                                            <Zap className="h-4 w-4" />
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                handleImageFilter(
                                                                    'sepia',
                                                                )
                                                            }
                                                            className={`rounded-xl p-3 transition-all ${salesPage.settings?.image_filters?.sepia ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-white/10 hover:text-white'}`}
                                                            title="Sepia Mood"
                                                        >
                                                            <Palette className="h-4 w-4" />
                                                        </button>
                                                        <div className="mx-1 h-6 w-px bg-white/10" />
                                                        <button
                                                            onClick={() =>
                                                                handleRegenerateImage()
                                                            }
                                                            className="rounded-xl p-3 text-indigo-400 transition-all hover:bg-indigo-500/10"
                                                            title="New AI Image"
                                                        >
                                                            <RefreshCw className="h-4 w-4" />
                                                        </button>
                                                    </div>

                                                    <img
                                                        src={heroImage}
                                                        alt="Magic Hero"
                                                        referrerPolicy="no-referrer"
                                                        className={`h-full w-full object-cover transition-all duration-700 ${salesPage.settings?.image_filters?.grayscale ? 'grayscale' : ''} ${salesPage.settings?.image_filters?.invert ? 'invert' : ''} ${salesPage.settings?.image_filters?.sepia ? 'sepia' : ''} ${salesPage.theme === 'dark_tech' && !salesPage.settings?.image_filters ? 'brightness-50 contrast-150 grayscale invert' : ''}`}
                                                        onError={(e) => {
                                                            e.currentTarget.onerror =
                                                                null;
                                                            e.currentTarget.src =
                                                                getFallbackImage();
                                                        }}
                                                    />
                                                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                                                    <div className="absolute right-6 top-6 flex items-center space-x-2">
                                                        {/* Floating Style Selector */}
                                                        <div className="group/style relative">
                                                            <button className="flex items-center space-x-2 rounded-full border border-white/30 bg-white/20 px-4 py-2 text-white shadow-xl backdrop-blur-md transition-all hover:bg-white/30">
                                                                <Palette className="h-3 w-3" />
                                                                <span className="text-[10px] font-black uppercase tracking-widest">
                                                                    {
                                                                        salesPage.image_style
                                                                    }
                                                                </span>
                                                            </button>

                                                            {/* Dropdown Menu */}
                                                            <div className="invisible absolute right-0 top-full z-50 mt-2 w-48 rounded-2xl border border-white/10 bg-[#1a1a24] p-2 opacity-0 shadow-2xl transition-all group-hover/style:visible group-hover/style:opacity-100">
                                                                {[
                                                                    {
                                                                        id: 'cinematic',
                                                                        name: 'Cinematic',
                                                                    },
                                                                    {
                                                                        id: 'minimalist white',
                                                                        name: 'Minimalist',
                                                                    },
                                                                    {
                                                                        id: 'cyberpunk neon',
                                                                        name: 'Cyberpunk',
                                                                    },
                                                                    {
                                                                        id: 'professional office',
                                                                        name: 'Corporate',
                                                                    },
                                                                    {
                                                                        id: '3d render toy',
                                                                        name: 'Playful 3D',
                                                                    },
                                                                    {
                                                                        id: 'abstract gradient',
                                                                        name: 'Abstract',
                                                                    },
                                                                ].map((s) => (
                                                                    <button
                                                                        key={
                                                                            s.id
                                                                        }
                                                                        onClick={() =>
                                                                            handleUpdateImageStyle(
                                                                                s.id,
                                                                            )
                                                                        }
                                                                        className={`w-full rounded-xl px-4 py-2.5 text-left text-[10px] font-bold uppercase tracking-widest transition-all ${salesPage.image_style === s.id ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                                                                    >
                                                                        {s.name}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </div>

                                                        <button
                                                            onClick={
                                                                handleRegenerateImage
                                                            }
                                                            className="flex items-center space-x-2 rounded-full bg-indigo-600 px-4 py-2 text-white shadow-xl transition-all hover:bg-indigo-700"
                                                        >
                                                            <RefreshCw className="h-3 w-3" />
                                                            <span className="text-[10px] font-black uppercase tracking-widest">
                                                                Regenerate
                                                            </span>
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="group relative">
                                                    <button
                                                        data-section="cta"
                                                        onClick={(e) =>
                                                            handleTextClick(
                                                                e,
                                                                'cta',
                                                            )
                                                        }
                                                        contentEditable
                                                        suppressContentEditableWarning
                                                        onBlur={(e) =>
                                                            handleBlur(
                                                                'cta',
                                                                e.currentTarget
                                                                    .innerHTML,
                                                            )
                                                        }
                                                        className={`transform rounded-full px-12 py-6 text-xl font-black shadow-2xl outline-none transition-all hover:scale-110 active:scale-95 ${isMagicLoading && selectedSection === 'cta' ? 'animate-pulse-shimmer' : ''} ${salesPage.theme === 'corporate' ? 'bg-blue-900 text-white' : salesPage.theme === 'minimalist' ? 'bg-slate-900 text-white' : salesPage.theme === 'dark_tech' ? 'border-2 border-black bg-green-500 text-black' : salesPage.theme === 'vibrant' ? 'bg-gradient-to-r from-indigo-500 via-purple-600 to-fuchsia-600 text-white shadow-fuchsia-500/20' : 'bg-indigo-600 text-white'}`}
                                                        dangerouslySetInnerHTML={{
                                                            __html: copy.cta,
                                                        }}
                                                    />
                                                    <button
                                                        onClick={() =>
                                                            handleRegenerate(
                                                                'cta',
                                                            )
                                                        }
                                                        className="absolute -right-12 top-1/2 -translate-y-1/2 rounded-full p-3 text-indigo-500 opacity-0 transition-all hover:bg-indigo-500/10 group-hover:opacity-100"
                                                    >
                                                        <RefreshCw
                                                            className={`h-5 w-5 ${isRegenerating === 'cta' ? 'animate-spin' : ''}`}
                                                        />
                                                    </button>
                                                </div>
                                                <section
                                                    className={`${viewport === 'mobile' ? 'py-16' : 'py-32'} ${salesPage.theme === 'corporate' || salesPage.theme === 'minimalist' ? 'border-slate-100' : salesPage.theme === 'dark_tech' ? 'border-green-500/20' : 'border-white/10'}`}
                                                >
                                                    <div
                                                        className={`grid gap-20 text-left ${viewport === 'mobile' ? 'grid-cols-1 gap-12' : 'grid-cols-2'}`}
                                                    >
                                                        <div className="group relative">
                                                            <h4
                                                                className={`mb-6 text-[11px] font-black uppercase tracking-[0.3em] ${salesPage.theme === 'dark_tech' ? 'text-green-500' : 'text-red-500'}`}
                                                            >
                                                                The Pain Point
                                                            </h4>
                                                            <p
                                                                data-section="problem"
                                                                onClick={(e) =>
                                                                    handleTextClick(
                                                                        e,
                                                                        'problem',
                                                                    )
                                                                }
                                                                contentEditable
                                                                suppressContentEditableWarning
                                                                onBlur={(e) =>
                                                                    handleBlur(
                                                                        'problem',
                                                                        e
                                                                            .currentTarget
                                                                            .innerHTML,
                                                                    )
                                                                }
                                                                className={`cursor-text text-2xl leading-relaxed outline-none ${isMagicLoading && selectedSection === 'problem' ? 'animate-pulse-shimmer' : ''}`}
                                                                dangerouslySetInnerHTML={{
                                                                    __html: copy.problem,
                                                                }}
                                                            />
                                                            <button
                                                                onClick={() =>
                                                                    handleRegenerate(
                                                                        'problem',
                                                                    )
                                                                }
                                                                className="absolute -right-10 top-0 rounded-full p-3 text-indigo-500 opacity-0 transition-all hover:bg-indigo-500/10 group-hover:opacity-100"
                                                            >
                                                                <RefreshCw
                                                                    className={`h-4 w-4 ${isRegenerating === 'problem' ? 'animate-spin' : ''}`}
                                                                />
                                                            </button>
                                                        </div>
                                                        <div className="group relative">
                                                            <h4
                                                                className={`mb-6 text-[11px] font-black uppercase tracking-[0.3em] ${salesPage.theme === 'dark_tech' ? 'text-green-300' : 'text-green-500'}`}
                                                            >
                                                                The Solution
                                                            </h4>
                                                            <p
                                                                data-section="solution"
                                                                onClick={(e) =>
                                                                    handleTextClick(
                                                                        e,
                                                                        'solution',
                                                                    )
                                                                }
                                                                contentEditable
                                                                suppressContentEditableWarning
                                                                onBlur={(e) =>
                                                                    handleBlur(
                                                                        'solution',
                                                                        e
                                                                            .currentTarget
                                                                            .innerHTML,
                                                                    )
                                                                }
                                                                className={`cursor-text text-2xl leading-relaxed outline-none ${isMagicLoading && selectedSection === 'solution' ? 'animate-pulse-shimmer' : ''}`}
                                                                dangerouslySetInnerHTML={{
                                                                    __html: copy.solution,
                                                                }}
                                                            />
                                                            <button
                                                                onClick={() =>
                                                                    handleRegenerate(
                                                                        'solution',
                                                                    )
                                                                }
                                                                className="absolute -right-10 top-0 rounded-full p-3 text-indigo-500 opacity-0 transition-all hover:bg-indigo-500/10 group-hover:opacity-100"
                                                            >
                                                                <RefreshCw
                                                                    className={`h-4 w-4 ${isRegenerating === 'solution' ? 'animate-spin' : ''}`}
                                                                />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </section>

                                                {/* Benefits Grid */}
                                                <section
                                                    className={`${viewport === 'mobile' ? 'py-16' : 'py-32'} mx-auto max-w-6xl px-6`}
                                                >
                                                    <div
                                                        className={`grid gap-12 text-left md:gap-20 ${viewport === 'mobile' ? 'grid-cols-1' : 'md:grid-cols-2'}`}
                                                    >
                                                        {copy.benefits.map(
                                                            (
                                                                benefit: string,
                                                                i: number,
                                                            ) => (
                                                                <div
                                                                    key={i}
                                                                    className="group/benefit relative flex flex-row items-start space-x-6 md:space-x-10"
                                                                >
                                                                    <div
                                                                        className={`flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl text-xl font-black text-white shadow-xl md:h-20 md:w-20 md:rounded-[2.5rem] md:text-2xl ${salesPage.theme === 'dark_tech' ? 'bg-green-600 shadow-green-500/20' : 'bg-indigo-600 shadow-indigo-500/20'}`}
                                                                    >
                                                                        {benefit.charAt(
                                                                            0,
                                                                        )}
                                                                    </div>
                                                                    <div className="space-y-3">
                                                                        <h4 className="text-xl font-black tracking-tight md:text-2xl">
                                                                            {benefit
                                                                                .split(
                                                                                    ' ',
                                                                                )
                                                                                .slice(
                                                                                    0,
                                                                                    3,
                                                                                )
                                                                                .join(
                                                                                    ' ',
                                                                                )}
                                                                        </h4>
                                                                        <p
                                                                            data-section={`benefits.${i}`}
                                                                            contentEditable
                                                                            suppressContentEditableWarning
                                                                            onBlur={(
                                                                                e,
                                                                            ) =>
                                                                                handleBlur(
                                                                                    `benefits.${i}`,
                                                                                    e
                                                                                        .currentTarget
                                                                                        .innerText,
                                                                                )
                                                                            }
                                                                            onClick={(
                                                                                e,
                                                                            ) =>
                                                                                handleTextClick(
                                                                                    e,
                                                                                    `benefits.${i}`,
                                                                                )
                                                                            }
                                                                            className={`cursor-text rounded-xl text-base leading-relaxed opacity-60 outline-none transition-all hover:bg-indigo-500/5 md:text-lg ${isMagicLoading && selectedSection === `benefits.${i}` ? 'animate-pulse-shimmer' : ''}`}
                                                                        >
                                                                            {
                                                                                benefit
                                                                            }
                                                                        </p>
                                                                    </div>
                                                                    <button
                                                                        onClick={() => {
                                                                            const newBenefits =
                                                                                [
                                                                                    ...copy.benefits,
                                                                                ];
                                                                            newBenefits.splice(
                                                                                i,
                                                                                1,
                                                                            );
                                                                            handleUpdateContent(
                                                                                'benefits',
                                                                                newBenefits,
                                                                            );
                                                                        }}
                                                                        className="no-print absolute -left-12 top-0 rounded-full p-3 text-red-500 opacity-0 transition-all hover:bg-red-500/10 group-hover/benefit:opacity-100"
                                                                    >
                                                                        <X className="h-4 w-4" />
                                                                    </button>
                                                                </div>
                                                            ),
                                                        )}
                                                    </div>
                                                </section>

                                                {/* Features Breakdown */}
                                                <section
                                                    className={`${viewport === 'mobile' ? 'py-16' : 'py-32'} ${isCorporate || isMinimal ? 'bg-slate-50' : 'bg-white/5'}`}
                                                >
                                                    <div
                                                        className={`grid gap-16 text-left ${viewport === 'mobile' ? 'grid-cols-1' : 'md:grid-cols-2'}`}
                                                    >
                                                        {copy.features_breakdown.map(
                                                            (
                                                                f: any,
                                                                i: number,
                                                            ) => (
                                                                <div
                                                                    key={i}
                                                                    className="group/feature relative flex space-x-8"
                                                                >
                                                                    <div
                                                                        className={`flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl text-xl font-black text-white shadow-xl ${salesPage.theme === 'dark_tech' ? 'bg-green-600 shadow-green-500/20' : 'bg-indigo-600 shadow-indigo-600/20'}`}
                                                                    >
                                                                        {f.title.charAt(
                                                                            0,
                                                                        )}
                                                                    </div>
                                                                    <div className="space-y-3">
                                                                        <h4
                                                                            data-section={`features_breakdown.${i}.title`}
                                                                            contentEditable
                                                                            suppressContentEditableWarning
                                                                            onBlur={(
                                                                                e,
                                                                            ) =>
                                                                                handleBlur(
                                                                                    `features_breakdown.${i}.title`,
                                                                                    e
                                                                                        .currentTarget
                                                                                        .innerText,
                                                                                )
                                                                            }
                                                                            onClick={(
                                                                                e,
                                                                            ) =>
                                                                                handleTextClick(
                                                                                    e,
                                                                                    `features_breakdown.${i}.title`,
                                                                                )
                                                                            }
                                                                            className={`cursor-text rounded-xl text-2xl font-bold outline-none transition-all hover:bg-indigo-500/5 ${isMagicLoading && selectedSection === `features_breakdown.${i}.title` ? 'animate-pulse-shimmer' : ''}`}
                                                                        >
                                                                            {
                                                                                f.title
                                                                            }
                                                                        </h4>
                                                                        <p
                                                                            data-section={`features_breakdown.${i}.description`}
                                                                            contentEditable
                                                                            suppressContentEditableWarning
                                                                            onBlur={(
                                                                                e,
                                                                            ) =>
                                                                                handleBlur(
                                                                                    `features_breakdown.${i}.description`,
                                                                                    e
                                                                                        .currentTarget
                                                                                        .innerText,
                                                                                )
                                                                            }
                                                                            onClick={(
                                                                                e,
                                                                            ) =>
                                                                                handleTextClick(
                                                                                    e,
                                                                                    `features_breakdown.${i}.description`,
                                                                                )
                                                                            }
                                                                            className={`cursor-text rounded-xl text-lg leading-relaxed opacity-60 outline-none transition-all hover:bg-indigo-500/5 ${isMagicLoading && selectedSection === `features_breakdown.${i}.description` ? 'animate-pulse-shimmer' : ''}`}
                                                                        >
                                                                            {
                                                                                f.description
                                                                            }
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            ),
                                                        )}
                                                    </div>
                                                </section>

                                                {/* Testimonials Section */}
                                                {salesPage.settings
                                                    ?.visible_sections
                                                    ?.testimonials && (
                                                    <div
                                                        className={`${viewport === 'mobile' ? 'pt-12' : 'pt-24'}`}
                                                    >
                                                        <h3
                                                            className={`mb-12 text-center text-[10px] font-black uppercase tracking-[0.3em] ${salesPage.theme === 'dark_tech' ? 'text-green-500' : 'text-gray-400'}`}
                                                        >
                                                            What People Say
                                                        </h3>

                                                        {isRegenerating ===
                                                        'testimonials' ? (
                                                            <div
                                                                className={`grid gap-8 ${viewport === 'mobile' ? 'grid-cols-1' : 'md:grid-cols-3'}`}
                                                            >
                                                                {[1, 2, 3].map(
                                                                    (i) => (
                                                                        <div
                                                                            key={
                                                                                i
                                                                            }
                                                                            className={`animate-pulse-shimmer rounded-3xl border p-8 ${salesPage.theme === 'dark_tech' ? 'border-green-500/20 bg-white/5' : 'border-slate-100 bg-slate-50'}`}
                                                                        >
                                                                            <div className="mb-3 h-4 w-full rounded-full bg-gray-400/20" />
                                                                            <div className="mb-8 h-4 w-5/6 rounded-full bg-gray-400/20" />
                                                                            <div className="flex items-center space-x-3">
                                                                                <div className="h-10 w-10 rounded-full bg-gray-400/20" />
                                                                                <div className="space-y-2">
                                                                                    <div className="h-3 w-20 rounded-full bg-gray-400/20" />
                                                                                    <div className="h-2 w-12 rounded-full bg-gray-400/20" />
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    ),
                                                                )}
                                                            </div>
                                                        ) : copy.testimonials ? (
                                                            <div
                                                                className={`grid gap-8 ${viewport === 'mobile' ? 'grid-cols-1' : 'md:grid-cols-3'}`}
                                                            >
                                                                {copy.testimonials.map(
                                                                    (
                                                                        t: any,
                                                                        i: number,
                                                                    ) => (
                                                                        <div
                                                                            key={
                                                                                i
                                                                            }
                                                                            className={`group/card rounded-3xl border p-8 transition-all hover:scale-105 ${salesPage.theme === 'dark_tech' ? 'border-green-500/20 bg-white/5 text-green-400' : 'border-slate-100 bg-white shadow-sm'}`}
                                                                        >
                                                                            <p
                                                                                data-section={`testimonials.${i}.content`}
                                                                                contentEditable
                                                                                suppressContentEditableWarning
                                                                                onBlur={(
                                                                                    e,
                                                                                ) =>
                                                                                    handleBlur(
                                                                                        `testimonials.${i}.content`,
                                                                                        e
                                                                                            .currentTarget
                                                                                            .innerText,
                                                                                    )
                                                                                }
                                                                                onClick={(
                                                                                    e,
                                                                                ) =>
                                                                                    handleTextClick(
                                                                                        e,
                                                                                        `testimonials.${i}.content`,
                                                                                    )
                                                                                }
                                                                                className={`mb-6 cursor-text rounded-xl italic outline-none transition-all hover:bg-indigo-500/5 ${isMagicLoading && selectedSection === `testimonials.${i}.content` ? 'animate-pulse-shimmer' : ''}`}
                                                                            >
                                                                                "
                                                                                {
                                                                                    t.content
                                                                                }

                                                                                "
                                                                            </p>
                                                                            <div className="flex items-center space-x-3">
                                                                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-600">
                                                                                    {
                                                                                        t
                                                                                            .name[0]
                                                                                    }
                                                                                </div>
                                                                                <div>
                                                                                    <div
                                                                                        data-section={`testimonials.${i}.name`}
                                                                                        contentEditable
                                                                                        suppressContentEditableWarning
                                                                                        onBlur={(
                                                                                            e,
                                                                                        ) =>
                                                                                            handleBlur(
                                                                                                `testimonials.${i}.name`,
                                                                                                e
                                                                                                    .currentTarget
                                                                                                    .innerText,
                                                                                            )
                                                                                        }
                                                                                        onClick={(
                                                                                            e,
                                                                                        ) =>
                                                                                            handleTextClick(
                                                                                                e,
                                                                                                `testimonials.${i}.name`,
                                                                                            )
                                                                                        }
                                                                                        className="cursor-text rounded-lg px-1 text-sm font-bold outline-none transition-all hover:bg-indigo-500/5"
                                                                                    >
                                                                                        {
                                                                                            t.name
                                                                                        }
                                                                                    </div>
                                                                                    <div
                                                                                        data-section={`testimonials.${i}.role`}
                                                                                        contentEditable
                                                                                        suppressContentEditableWarning
                                                                                        onBlur={(
                                                                                            e,
                                                                                        ) =>
                                                                                            handleBlur(
                                                                                                `testimonials.${i}.role`,
                                                                                                e
                                                                                                    .currentTarget
                                                                                                    .innerText,
                                                                                            )
                                                                                        }
                                                                                        onClick={(
                                                                                            e,
                                                                                        ) =>
                                                                                            handleTextClick(
                                                                                                e,
                                                                                                `testimonials.${i}.role`,
                                                                                            )
                                                                                        }
                                                                                        className="cursor-text rounded-lg px-1 text-[10px] uppercase tracking-wider opacity-50 outline-none transition-all hover:bg-indigo-500/5"
                                                                                    >
                                                                                        {
                                                                                            t.role
                                                                                        }
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    ),
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <button
                                                                onClick={() =>
                                                                    handleRegenerate(
                                                                        'testimonials',
                                                                    )
                                                                }
                                                                className="group w-full rounded-[3rem] border-2 border-dashed border-white/10 py-20 transition-all hover:bg-white/5"
                                                            >
                                                                <div className="flex flex-col items-center space-y-4">
                                                                    <div className="rounded-2xl bg-purple-500/20 p-4 text-purple-400 transition-all group-hover:scale-110">
                                                                        <Zap className="h-8 w-8" />
                                                                    </div>
                                                                    <div className="font-bold text-gray-500">
                                                                        Generate
                                                                        Testimonials
                                                                        with AI
                                                                    </div>
                                                                </div>
                                                            </button>
                                                        )}
                                                    </div>
                                                )}

                                                {/* FAQ Section */}
                                                {salesPage.settings
                                                    ?.visible_sections?.faq && (
                                                    <div
                                                        className={`${viewport === 'mobile' ? 'pt-16' : 'pt-32'} mx-auto max-w-3xl px-6 text-left`}
                                                    >
                                                        <h3
                                                            className={`mb-12 text-center text-[10px] font-black uppercase tracking-[0.3em] ${salesPage.theme === 'dark_tech' ? 'text-green-500' : 'text-gray-400'}`}
                                                        >
                                                            Common Questions
                                                        </h3>

                                                        {isRegenerating ===
                                                        'faq' ? (
                                                            <div className="space-y-4">
                                                                {[
                                                                    1, 2, 3, 4,
                                                                ].map((i) => (
                                                                    <div
                                                                        key={i}
                                                                        className={`animate-pulse-shimmer rounded-2xl border p-6 ${salesPage.theme === 'dark_tech' ? 'border-green-500/20 bg-black' : 'border-slate-100 bg-slate-50'}`}
                                                                    >
                                                                        <div className="mb-4 h-4 w-2/3 rounded-full bg-gray-400/20" />
                                                                        <div className="h-3 w-full rounded-full bg-gray-400/20" />
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        ) : copy.faq ? (
                                                            <div className="space-y-4">
                                                                {copy.faq.map(
                                                                    (
                                                                        f: any,
                                                                        i: number,
                                                                    ) => (
                                                                        <div
                                                                            key={
                                                                                i
                                                                            }
                                                                            className={`rounded-2xl border p-6 transition-all hover:border-indigo-500/30 ${salesPage.theme === 'dark_tech' ? 'border-green-500/20 bg-black' : 'border-slate-100 bg-white shadow-sm'}`}
                                                                        >
                                                                            <div className="mb-2 flex items-center space-x-2 font-bold text-indigo-500">
                                                                                <span>
                                                                                    Q:
                                                                                </span>
                                                                                <span
                                                                                    data-section={`faq.${i}.question`}
                                                                                    contentEditable
                                                                                    suppressContentEditableWarning
                                                                                    onBlur={(
                                                                                        e,
                                                                                    ) =>
                                                                                        handleBlur(
                                                                                            `faq.${i}.question`,
                                                                                            e
                                                                                                .currentTarget
                                                                                                .innerText,
                                                                                        )
                                                                                    }
                                                                                    onClick={(
                                                                                        e,
                                                                                    ) =>
                                                                                        handleTextClick(
                                                                                            e,
                                                                                            `faq.${i}.question`,
                                                                                        )
                                                                                    }
                                                                                    className={`cursor-text rounded-lg px-1 outline-none transition-all hover:bg-indigo-500/5 ${salesPage.theme === 'dark_tech' ? 'text-green-400' : 'text-slate-900'} ${isMagicLoading && selectedSection === `faq.${i}.question` ? 'animate-pulse-shimmer' : ''}`}
                                                                                >
                                                                                    {
                                                                                        f.question
                                                                                    }
                                                                                </span>
                                                                            </div>
                                                                            <div
                                                                                data-section={`faq.${i}.answer`}
                                                                                contentEditable
                                                                                suppressContentEditableWarning
                                                                                onBlur={(
                                                                                    e,
                                                                                ) =>
                                                                                    handleBlur(
                                                                                        `faq.${i}.answer`,
                                                                                        e
                                                                                            .currentTarget
                                                                                            .innerText,
                                                                                    )
                                                                                }
                                                                                onClick={(
                                                                                    e,
                                                                                ) =>
                                                                                    handleTextClick(
                                                                                        e,
                                                                                        `faq.${i}.answer`,
                                                                                    )
                                                                                }
                                                                                className={`cursor-text rounded-lg px-1 text-sm leading-relaxed opacity-60 outline-none transition-all hover:bg-indigo-500/5 ${isMagicLoading && selectedSection === `faq.${i}.answer` ? 'animate-pulse-shimmer' : ''}`}
                                                                            >
                                                                                {
                                                                                    f.answer
                                                                                }
                                                                            </div>
                                                                        </div>
                                                                    ),
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <button
                                                                onClick={() =>
                                                                    handleRegenerate(
                                                                        'faq',
                                                                    )
                                                                }
                                                                className="group w-full rounded-[3rem] border-2 border-dashed border-white/10 py-20 transition-all hover:bg-white/5"
                                                            >
                                                                <div className="flex flex-col items-center space-y-4">
                                                                    <div className="rounded-2xl bg-indigo-500/20 p-4 text-indigo-400 transition-all group-hover:scale-110">
                                                                        <Zap className="h-8 w-8" />
                                                                    </div>
                                                                    <div className="font-bold text-gray-500">
                                                                        Generate
                                                                        FAQ with
                                                                        AI
                                                                    </div>
                                                                </div>
                                                            </button>
                                                        )}
                                                    </div>
                                                )}

                                                <div className="pb-16 pt-24">
                                                    <div
                                                        className={`group relative overflow-hidden rounded-[2.5rem] p-10 shadow-2xl transition-all md:rounded-[4rem] md:p-24 ${salesPage.theme === 'minimalist' ? 'bg-slate-900 text-white' : salesPage.theme === 'corporate' ? 'bg-blue-950 text-white' : salesPage.theme === 'dark_tech' ? 'border-4 border-green-500 bg-black text-green-500' : 'bg-indigo-950 text-white shadow-indigo-500/10'}`}
                                                    >
                                                        <h2
                                                            className={`mb-10 font-bold ${viewport === 'mobile' ? 'text-2xl' : 'text-4xl'}`}
                                                        >
                                                            Start Your Journey
                                                        </h2>
                                                        <div
                                                            data-section="pricing_display"
                                                            onClick={(e) =>
                                                                handleTextClick(
                                                                    e,
                                                                    'pricing_display',
                                                                )
                                                            }
                                                            contentEditable
                                                            suppressContentEditableWarning
                                                            onBlur={(e) =>
                                                                handleBlur(
                                                                    'pricing_display',
                                                                    e
                                                                        .currentTarget
                                                                        .innerHTML,
                                                                )
                                                            }
                                                            className={`mb-12 cursor-text font-black tracking-tighter outline-none ${isMagicLoading && selectedSection === 'pricing_display' ? 'animate-pulse-shimmer' : ''} ${viewport === 'mobile' ? 'text-6xl' : 'text-9xl'}`}
                                                            dangerouslySetInnerHTML={{
                                                                __html: copy.pricing_display,
                                                            }}
                                                        />
                                                        <p
                                                            data-section="social_proof_placeholder"
                                                            onClick={(e) =>
                                                                handleTextClick(
                                                                    e,
                                                                    'social_proof_placeholder',
                                                                )
                                                            }
                                                            contentEditable
                                                            suppressContentEditableWarning
                                                            onBlur={(e) =>
                                                                handleBlur(
                                                                    'social_proof_placeholder',
                                                                    e
                                                                        .currentTarget
                                                                        .innerHTML,
                                                                )
                                                            }
                                                            className={`mx-auto mb-16 max-w-lg cursor-text text-xl leading-relaxed opacity-60 outline-none ${isMagicLoading && selectedSection === 'social_proof_placeholder' ? 'animate-pulse-shimmer' : ''} ${viewport === 'mobile' ? 'text-lg' : 'text-xl'}`}
                                                            dangerouslySetInnerHTML={{
                                                                __html: copy.social_proof_placeholder,
                                                            }}
                                                        />
                                                        <button
                                                            className={`transform rounded-full bg-white px-16 py-7 text-2xl font-black transition-all hover:scale-110 active:scale-95 ${salesPage.theme === 'dark_tech' ? 'text-black' : 'text-indigo-900'} ${viewport === 'mobile' ? 'text-xl' : 'text-2xl'}`}
                                                        >
                                                            {copy.cta}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ) : activeTab === 'conversion' ? (
                                    <motion.div
                                        key="conversion"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="rounded-[2.5rem] border border-white/10 bg-[#121217] p-10"
                                    >
                                        <div className="mb-10 flex items-center justify-between border-b border-white/5 pb-6">
                                            <h3 className="text-2xl font-bold text-white">
                                                Conversion Settings
                                            </h3>
                                            <div className="flex items-center space-x-2 rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1 text-green-400">
                                                <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
                                                <span className="text-[10px] font-black uppercase tracking-widest">
                                                    WhatsApp Active
                                                </span>
                                            </div>
                                        </div>

                                        <div className="space-y-8">
                                            <div className="space-y-4">
                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
                                                    Target CTA
                                                </label>
                                                <div className="flex rounded-2xl border border-white/10 bg-white/5 p-1">
                                                    <button className="flex-1 rounded-xl bg-indigo-600 px-4 py-3 text-xs font-bold text-white shadow-lg">
                                                        WhatsApp Business
                                                    </button>
                                                    <button className="flex-1 px-4 py-3 text-xs font-bold text-gray-500 transition-colors hover:text-white">
                                                        Email (Soon)
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
                                                    WhatsApp Number
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="e.g. 628123456789"
                                                    value={waNumber}
                                                    onChange={(e) =>
                                                        setWaNumber(
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="w-full rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-lg text-white outline-none transition-all focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                                                />
                                                <p className="text-[10px] italic text-gray-500">
                                                    Start with country code
                                                    (e.g. 62 for Indonesia)
                                                </p>
                                            </div>

                                            <div className="space-y-4">
                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
                                                    Custom Message
                                                </label>
                                                <textarea
                                                    rows={4}
                                                    value={waMessage}
                                                    onChange={(e) =>
                                                        setWaMessage(
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="w-full resize-none rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-lg text-white outline-none transition-all focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                                                />
                                            </div>

                                            <div className="rounded-[2rem] border border-indigo-500/10 bg-indigo-500/5 p-6">
                                                <h4 className="mb-2 text-sm font-bold text-indigo-400">
                                                    💡 Pro Tip
                                                </h4>
                                                <p className="text-xs leading-relaxed text-gray-500">
                                                    Linking your CTA to WhatsApp
                                                    can increase conversion
                                                    rates by up to 40% in some
                                                    markets. Make sure your
                                                    message is welcoming!
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="content"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="rounded-[2.5rem] border border-white/10 bg-[#121217] p-10"
                                    >
                                        <div className="mb-10 flex items-center justify-between border-b border-white/5 pb-6">
                                            <h3 className="text-2xl font-bold text-white">
                                                Data Structure
                                            </h3>
                                            <button
                                                onClick={() => {
                                                    navigator.clipboard.writeText(
                                                        JSON.stringify(
                                                            copy,
                                                            null,
                                                            2,
                                                        ),
                                                    );
                                                    toast.success(
                                                        'JSON Copied!',
                                                    );
                                                }}
                                                className="text-xs font-bold text-indigo-400"
                                            >
                                                COPY JSON
                                            </button>
                                        </div>
                                        <div className="space-y-10 text-gray-400">
                                            {Object.entries(copy).map(
                                                ([key, value]) => (
                                                    <div
                                                        key={key}
                                                        className="space-y-2"
                                                    >
                                                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-600">
                                                            {key}
                                                        </label>
                                                        <div className="rounded-2xl bg-white/[0.02] p-6 italic">
                                                            {Array.isArray(
                                                                value,
                                                            )
                                                                ? value.join(
                                                                      ', ',
                                                                  )
                                                                : value}
                                                        </div>
                                                    </div>
                                                ),
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
            <style
                dangerouslySetInnerHTML={{
                    __html: `
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
            `,
                }}
            />
        </AuthenticatedLayout>
    );
}
