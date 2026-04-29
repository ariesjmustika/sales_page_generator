import { Head } from '@inertiajs/react';
import { Globe, Heart, MessageSquare, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

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
            meta_title?: string;
            meta_description?: string;
            faq?: Array<{question: string, answer: string}>;
            testimonials?: Array<{name: string, role: string, content: string}>;
        };
        theme: string;
        image_style: string;
        image_seed: number;
        settings?: {
            cta_type: string;
            whatsapp_number: string;
            whatsapp_message: string;
            image_filters?: {
                grayscale?: boolean;
                invert?: boolean;
                sepia?: boolean;
            };
            visible_sections?: {
                faq?: boolean;
                testimonials?: boolean;
            };
        };
    };
}

export default function Public({ salesPage }: Props) {
    const copy = salesPage.generated_copy;
    const t = salesPage.theme;
    
    const isVibrant = t === 'vibrant';
    const isCorporate = t === 'corporate';
    const isDarkTech = t === 'dark_tech';
    const isMinimal = t === 'minimalist';

    const magicPrompt = `${salesPage.product_name} ${salesPage.image_style} ${copy.image_keyword || ''}`.slice(0, 100);
    const heroImage = `https://image.pollinations.ai/prompt/${encodeURIComponent(magicPrompt)}?width=1200&height=800&nologo=true&seed=${salesPage.image_seed}`;

    const handleCtaClick = () => {
        if (salesPage.settings?.whatsapp_number) {
            const number = salesPage.settings.whatsapp_number.replace(/\D/g, '');
            const message = encodeURIComponent(salesPage.settings.whatsapp_message || '');
            window.open(`https://wa.me/${number}?text=${message}`, '_blank');
        } else {
            // Fallback or generic toast if no number
            alert('Contact details not configured yet.');
        }
    };

    return (
        <div className={`min-h-screen selection:bg-indigo-500/30 ${isCorporate || isMinimal ? 'bg-white text-slate-900' : isDarkTech ? 'bg-black text-green-400 font-mono' : isVibrant ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
            <Head>
                <title>{copy.meta_title || `${salesPage.product_name} - Sales Page`}</title>
                <meta name="description" content={copy.meta_description || `Discover ${salesPage.product_name} - High-converting solutions.`} />
                
                <meta property="og:type" content="website" />
                <meta property="og:title" content={copy.meta_title || salesPage.product_name} />
                <meta property="og:description" content={copy.meta_description || copy.subheadline} />
                <meta property="og:image" content={heroImage} />

                {/* Twitter */}
                <meta property="twitter:card" content="summary_large_image" />
                <meta property="twitter:title" content={`${salesPage.product_name}: ${copy.headline}`} />
                <meta property="twitter:description" content={copy.subheadline} />
                <meta property="twitter:image" content={heroImage} />
            </Head>
            
            <header className="py-12 md:py-24 px-6 max-w-6xl mx-auto flex flex-col items-center text-center space-y-10 md:space-y-16">
                <div className="flex items-center space-x-2 opacity-50 mb-4 scale-75">
                    <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-lg">M</span>
                    </div>
                    <span className="font-bold tracking-tight">MarketAI</span>
                </div>

                <h1 className={`outline-none px-2 md:px-4 rounded-2xl leading-[1.1] ${isCorporate || isMinimal ? 'text-4xl md:text-7xl font-serif text-slate-900' : isDarkTech ? 'text-4xl md:text-7xl font-bold uppercase italic' : isVibrant ? 'text-5xl md:text-8xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-indigo-400' : 'text-5xl md:text-8xl font-black text-slate-900'}`} dangerouslySetInnerHTML={{ __html: copy.headline }} />

                <p className={`text-lg md:text-2xl max-w-3xl mx-auto leading-relaxed ${isCorporate || isMinimal ? 'text-slate-500 italic' : isDarkTech ? 'text-green-800' : 'text-slate-400'}`} dangerouslySetInnerHTML={{ __html: copy.subheadline }} />

                <div className="w-full aspect-video rounded-2xl md:rounded-[3rem] overflow-hidden shadow-2xl border-2 md:border-4 border-white/10 relative group">
                    <img 
                        src={heroImage} 
                        alt="Hero" 
                        className={`w-full h-full object-cover transition-all duration-1000 ${salesPage.settings?.image_filters?.grayscale ? 'grayscale' : ''} ${salesPage.settings?.image_filters?.invert ? 'invert' : ''} ${salesPage.settings?.image_filters?.sepia ? 'sepia' : ''} ${isDarkTech && !salesPage.settings?.image_filters ? 'grayscale invert brightness-50 contrast-150' : ''}`} 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>

                <button 
                    onClick={handleCtaClick}
                    className={`px-10 md:px-16 py-5 md:py-7 rounded-full font-black text-xl md:text-2xl shadow-2xl transition-all transform hover:scale-105 active:scale-95 ${isCorporate ? 'bg-blue-900 text-white' : isMinimal ? 'bg-slate-900 text-white' : isDarkTech ? 'bg-green-500 text-black' : isVibrant ? 'bg-gradient-to-r from-indigo-500 via-purple-600 to-fuchsia-600 text-white shadow-fuchsia-500/20' : 'bg-indigo-600 text-white'}`}
                    dangerouslySetInnerHTML={{ __html: copy.cta }}
                />
            </header>

            <section className={`py-20 md:py-40 ${isCorporate || isMinimal ? 'bg-slate-50' : isDarkTech ? 'bg-white/5 border-y border-green-500/20' : 'bg-white/5'}`}>
                <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20">
                    <div>
                        <h4 className={`text-[10px] md:text-[11px] font-black uppercase tracking-[0.3em] mb-4 md:mb-6 ${isDarkTech ? 'text-green-500' : 'text-red-500'}`}>The Pain Point</h4>
                        <p className="text-xl md:text-2xl leading-relaxed" dangerouslySetInnerHTML={{ __html: copy.problem }} />
                    </div>
                    <div>
                        <h4 className={`text-[10px] md:text-[11px] font-black uppercase tracking-[0.3em] mb-4 md:mb-6 ${isDarkTech ? 'text-green-300' : 'text-green-500'}`}>The Solution</h4>
                        <p className="text-xl md:text-2xl leading-relaxed" dangerouslySetInnerHTML={{ __html: copy.solution }} />
                    </div>
                </div>
            </section>

            {/* Benefits Grid */}
            <section className="py-20 md:py-40 px-6 max-w-6xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 text-left">
                    {copy.benefits.map((benefit: string, i: number) => {
                        const words = benefit.split(' ');
                        const title = words.slice(0, 3).join(' ');
                        const desc = words.slice(3).join(' ');
                        return (
                            <div key={i} className="flex flex-row items-start space-x-6 md:space-x-10 group">
                                <div className={`flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-2xl md:rounded-[2.5rem] flex items-center justify-center text-white text-xl md:text-2xl font-black shadow-xl transition-transform group-hover:scale-110 ${isDarkTech ? 'bg-green-600 shadow-green-500/20' : 'bg-indigo-600 shadow-indigo-600/20'}`}>
                                    {benefit.charAt(0)}
                                </div>
                                <div className="space-y-3">
                                    <h4 className="text-xl md:text-3xl font-black tracking-tight">{title}</h4>
                                    <p className="opacity-60 leading-relaxed text-base md:text-lg">{desc}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Features Breakdown */}
            <section className={`py-20 md:py-40 ${isCorporate || isMinimal ? 'bg-slate-50' : 'bg-white/5'}`}>
                <div className="max-w-6xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 text-left">
                        {copy.features_breakdown.map((f: any, i: number) => (
                            <div key={i} className="flex space-x-6 md:space-x-10 group">
                                <div className={`flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-2xl md:rounded-[2.5rem] flex items-center justify-center text-white text-xl md:text-2xl font-black shadow-xl ${isDarkTech ? 'bg-green-600 shadow-green-500/20' : 'bg-indigo-600 shadow-indigo-600/20'}`}>
                                    {f.title.charAt(0)}
                                </div>
                                <div className="space-y-3">
                                    <h4 className="text-xl md:text-3xl font-black tracking-tight">{f.title}</h4>
                                    <p className="opacity-60 leading-relaxed text-base md:text-lg">{f.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            {salesPage.settings?.visible_sections?.testimonials && copy.testimonials && (
                <section className="py-20 md:py-40 max-w-6xl mx-auto px-6">
                    <h3 className={`text-[10px] font-black uppercase tracking-[0.4em] mb-12 md:mb-20 text-center ${isDarkTech ? 'text-green-500' : 'text-gray-400'}`}>What People Say</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
                        {copy.testimonials.map((t: any, i: number) => (
                            <div key={i} className={`p-8 md:p-12 rounded-2xl md:rounded-[3.5rem] border ${isDarkTech ? 'bg-white/5 border-green-500/20 text-green-400' : 'bg-white border-slate-100 shadow-sm'}`}>
                                <p className="italic mb-6 text-base md:text-lg leading-relaxed">"{t.content}"</p>
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-600 font-bold text-xl">{t.name[0]}</div>
                                    <div>
                                        <div className="font-bold text-base">{t.name}</div>
                                        <div className="text-[10px] opacity-50 uppercase tracking-widest font-black">{t.role}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* FAQ */}
            {salesPage.settings?.visible_sections?.faq && copy.faq && (
                <section className="py-20 md:py-40 max-w-4xl mx-auto px-6">
                    <h3 className={`text-[10px] font-black uppercase tracking-[0.4em] mb-12 md:mb-20 text-center ${isDarkTech ? 'text-green-500' : 'text-gray-400'}`}>Common Questions</h3>
                    <div className="space-y-6 md:space-y-8">
                        {copy.faq.map((f: any, i: number) => (
                            <div key={i} className={`p-8 md:p-10 rounded-2xl md:rounded-[3rem] border ${isDarkTech ? 'bg-black border-green-500/20' : 'bg-white border-slate-100 shadow-sm'}`}>
                                <div className="font-black text-xl md:text-2xl mb-4 md:mb-5 flex items-center space-x-4 text-indigo-500">
                                    <span className="opacity-30">Q:</span>
                                    <span className={isDarkTech ? 'text-green-400' : 'text-slate-900'}>{f.question}</span>
                                </div>
                                <div className="opacity-60 text-base md:text-lg leading-relaxed md:ml-12">{f.answer}</div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            <section className="py-20 md:py-40 px-6">
                <div className={`max-w-5xl mx-auto rounded-[3rem] md:rounded-[5rem] p-12 md:p-32 shadow-2xl relative overflow-hidden text-center ${isMinimal ? 'bg-slate-900 text-white' : isCorporate ? 'bg-blue-950 text-white' : isDarkTech ? 'bg-black border-4 border-green-500 text-green-500 shadow-[0_0_50px_rgba(34,197,94,0.2)]' : 'bg-indigo-950 text-white shadow-[0_50px_100px_-20px_rgba(79,70,229,0.3)]'}`}>
                    <h2 className="text-3xl md:text-4xl font-bold mb-10 opacity-80 uppercase tracking-widest">Start Your Journey</h2>
                    <div className="text-7xl md:text-[10rem] font-black mb-12 md:mb-16 tracking-tighter leading-none" dangerouslySetInnerHTML={{ __html: copy.pricing_display }} />
                    <p className="text-lg md:text-3xl opacity-60 mb-12 md:mb-20 max-w-2xl mx-auto leading-relaxed" dangerouslySetInnerHTML={{ __html: copy.social_proof_placeholder }} />
                    <button 
                        onClick={handleCtaClick}
                        className={`px-12 md:px-20 py-6 md:py-8 rounded-full font-black text-xl md:text-3xl transition-all transform hover:scale-110 active:scale-95 bg-white ${isDarkTech ? 'text-black' : 'text-indigo-900'}`}
                        dangerouslySetInnerHTML={{ __html: copy.cta }}
                    />
                </div>
            </section>

            <footer className="py-12 border-t border-white/5 flex flex-col items-center space-y-4 opacity-30">
                <div className="flex items-center space-x-2 text-sm">
                    <span>Built with</span>
                    <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                    <span>using MarketAI</span>
                </div>
            </footer>

            {/* Sticky Mobile CTA */}
            <div className="lg:hidden fixed bottom-6 left-6 right-6 z-[100]">
                <button 
                    onClick={handleCtaClick}
                    className="w-full py-5 bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white rounded-2xl font-black text-xl shadow-2xl shadow-indigo-600/40 backdrop-blur-xl border border-white/20 active:scale-95 transition-all flex items-center justify-center space-x-3"
                >
                    <MessageSquare className="w-6 h-6" />
                    <span dangerouslySetInnerHTML={{ __html: copy.cta }} />
                </button>
            </div>
        </div>
    );
}
