import { Head } from '@inertiajs/react';
import { Globe, Heart } from 'lucide-react';
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
        };
        theme: string;
    };
}

export default function Public({ salesPage }: Props) {
    const copy = salesPage.generated_copy;
    const t = salesPage.theme;
    
    const isVibrant = t === 'vibrant';
    const isCorporate = t === 'corporate';
    const isDarkTech = t === 'dark_tech';
    const isMinimal = t === 'minimalist';

    const magicPrompt = `${salesPage.product_name} ${copy.image_keyword || ''}`.slice(0, 50);
    const heroImage = `https://image.pollinations.ai/prompt/${encodeURIComponent(magicPrompt)}?width=1200&height=800&nologo=true&seed=${salesPage.id}`;

    return (
        <div className={`min-h-screen selection:bg-indigo-500/30 ${isCorporate || isMinimal ? 'bg-white text-slate-900' : isDarkTech ? 'bg-black text-green-400 font-mono' : isVibrant ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
            <Head>
                <title>{`${salesPage.product_name} - ${copy.headline}`}</title>
                <meta name="description" content={copy.subheadline} />
                
                {/* Open Graph / Facebook */}
                <meta property="og:type" content="website" />
                <meta property="og:title" content={`${salesPage.product_name}: ${copy.headline}`} />
                <meta property="og:description" content={copy.subheadline} />
                <meta property="og:image" content={heroImage} />

                {/* Twitter */}
                <meta property="twitter:card" content="summary_large_image" />
                <meta property="twitter:title" content={`${salesPage.product_name}: ${copy.headline}`} />
                <meta property="twitter:description" content={copy.subheadline} />
                <meta property="twitter:image" content={heroImage} />
            </Head>
            
            <header className="py-20 px-6 max-w-6xl mx-auto flex flex-col items-center text-center space-y-12">
                <div className="flex items-center space-x-2 opacity-50 mb-4 scale-75">
                    <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-lg">M</span>
                    </div>
                    <span className="font-bold tracking-tight">MarketAI</span>
                </div>

                <h1 className={`outline-none px-4 rounded-2xl leading-[1.1] ${isCorporate || isMinimal ? 'text-6xl font-serif text-slate-900' : isDarkTech ? 'text-6xl font-bold uppercase italic' : isVibrant ? 'text-7xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-indigo-400' : 'text-7xl font-black text-slate-900'}`}>
                    {copy.headline}
                </h1>

                <p className={`text-2xl max-w-3xl mx-auto leading-relaxed ${isCorporate || isMinimal ? 'text-slate-500 italic' : isDarkTech ? 'text-green-800' : 'text-slate-400'}`}>
                    {copy.subheadline}
                </p>

                <div className="w-full aspect-video rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white/10 relative group">
                    <img 
                        src={heroImage} 
                        alt="Hero" 
                        className={`w-full h-full object-cover transition-all duration-1000 ${isDarkTech ? 'grayscale invert brightness-50 contrast-150' : ''}`} 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>

                <button className={`px-16 py-7 rounded-full font-black text-2xl shadow-2xl transition-all transform hover:scale-105 active:scale-95 ${isCorporate ? 'bg-blue-900 text-white' : isMinimal ? 'bg-slate-900 text-white' : isDarkTech ? 'bg-green-500 text-black' : isVibrant ? 'bg-gradient-to-r from-indigo-500 via-purple-600 to-fuchsia-600 text-white shadow-fuchsia-500/20' : 'bg-indigo-600 text-white'}`}>
                    {copy.cta}
                </button>
            </header>

            <section className={`py-32 ${isCorporate || isMinimal ? 'bg-slate-50' : isDarkTech ? 'bg-white/5 border-y border-green-500/20' : 'bg-white/5'}`}>
                <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-2 gap-20">
                    <div>
                        <h4 className={`text-[11px] font-black uppercase tracking-[0.3em] mb-6 ${isDarkTech ? 'text-green-500' : 'text-red-500'}`}>The Pain Point</h4>
                        <p className="text-2xl leading-relaxed">{copy.problem}</p>
                    </div>
                    <div>
                        <h4 className={`text-[11px] font-black uppercase tracking-[0.3em] mb-6 ${isDarkTech ? 'text-green-300' : 'text-green-500'}`}>The Solution</h4>
                        <p className="text-2xl leading-relaxed">{copy.solution}</p>
                    </div>
                </div>
            </section>

            <section className="py-32 px-6">
                <div className={`max-w-4xl mx-auto rounded-[4rem] p-24 shadow-2xl relative overflow-hidden text-center ${isMinimal ? 'bg-slate-900 text-white' : isCorporate ? 'bg-blue-950 text-white' : isDarkTech ? 'bg-black border-4 border-green-500 text-green-500' : 'bg-indigo-950 text-white'}`}>
                    <h2 className="text-4xl font-bold mb-10">Start Your Journey</h2>
                    <div className="text-9xl font-black mb-12 tracking-tighter">{copy.pricing_display}</div>
                    <p className="text-xl opacity-60 mb-16 max-w-lg mx-auto leading-relaxed">{copy.social_proof_placeholder}</p>
                    <button className={`px-16 py-7 rounded-full font-black text-2xl transition-all transform hover:scale-110 active:scale-95 bg-white ${isDarkTech ? 'text-black' : 'text-indigo-900'}`}>
                        {copy.cta}
                    </button>
                </div>
            </section>

            <footer className="py-12 border-t border-white/5 flex flex-col items-center space-y-4 opacity-30">
                <div className="flex items-center space-x-2 text-sm">
                    <span>Built with</span>
                    <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                    <span>using MarketAI</span>
                </div>
            </footer>
        </div>
    );
}
