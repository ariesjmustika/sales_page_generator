import { Head } from '@inertiajs/react';
import { Heart, MessageSquare } from 'lucide-react';

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
            features_breakdown: Array<{ title: string; description: string }>;
            social_proof_placeholder: string;
            pricing_display: string;
            cta: string;
            image_keyword?: string;
            meta_title?: string;
            meta_description?: string;
            faq?: Array<{ question: string; answer: string }>;
            testimonials?: Array<{
                name: string;
                role: string;
                content: string;
            }>;
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

    const magicPrompt =
        `${salesPage.product_name} ${salesPage.image_style} ${copy.image_keyword || ''}`.slice(
            0,
            100,
        );
    const heroImage = `https://image.pollinations.ai/prompt/${encodeURIComponent(magicPrompt)}?width=1200&height=800&nologo=true&seed=${salesPage.image_seed}`;

    const handleCtaClick = () => {
        if (salesPage.settings?.whatsapp_number) {
            const number = salesPage.settings.whatsapp_number.replace(
                /\D/g,
                '',
            );
            const message = encodeURIComponent(
                salesPage.settings.whatsapp_message || '',
            );
            window.open(`https://wa.me/${number}?text=${message}`, '_blank');
        } else {
            // Fallback or generic toast if no number
            alert('Contact details not configured yet.');
        }
    };

    return (
        <div
            className={`min-h-screen selection:bg-indigo-500/30 ${isCorporate || isMinimal ? 'bg-white text-slate-900' : isDarkTech ? 'bg-black font-mono text-green-400' : isVibrant ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}
        >
            <Head>
                <title>
                    {copy.meta_title ||
                        `${salesPage.product_name} - Sales Page`}
                </title>
                <meta
                    name="description"
                    content={
                        copy.meta_description ||
                        `Discover ${salesPage.product_name} - High-converting solutions.`
                    }
                />

                <meta property="og:type" content="website" />
                <meta
                    property="og:title"
                    content={copy.meta_title || salesPage.product_name}
                />
                <meta
                    property="og:description"
                    content={copy.meta_description || copy.subheadline}
                />
                <meta property="og:image" content={heroImage} />

                {/* Twitter */}
                <meta property="twitter:card" content="summary_large_image" />
                <meta
                    property="twitter:title"
                    content={`${salesPage.product_name}: ${copy.headline}`}
                />
                <meta
                    property="twitter:description"
                    content={copy.subheadline}
                />
                <meta property="twitter:image" content={heroImage} />
            </Head>

            <header className="mx-auto flex max-w-6xl flex-col items-center space-y-10 px-6 py-12 text-center md:space-y-16 md:py-24">
                <div className="mb-4 flex scale-75 items-center space-x-2 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 shadow-lg shadow-indigo-600/20">
                        <span className="text-xl font-bold text-white">M</span>
                    </div>
                    <span className={`text-2xl font-black tracking-tighter ${isCorporate || isMinimal ? 'text-slate-900' : 'text-white'}`}>MarketAI</span>
                </div>

                <h1
                    className={`rounded-2xl px-2 leading-[1.1] tracking-tight outline-none md:px-4 ${isCorporate || isMinimal ? 'font-serif text-4xl text-slate-900 md:text-7xl' : isDarkTech ? 'text-4xl font-black uppercase italic text-green-400 md:text-7xl' : isVibrant ? 'bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-indigo-400 bg-clip-text text-5xl font-black text-transparent md:text-8xl' : 'text-5xl font-black text-slate-900 md:text-8xl'}`}
                    dangerouslySetInnerHTML={{ __html: copy.headline }}
                />

                <p
                    className={`mx-auto max-w-3xl text-lg leading-relaxed md:text-2xl ${isCorporate || isMinimal ? 'font-medium italic text-slate-600' : isDarkTech ? 'font-mono text-green-500/90' : 'font-medium text-slate-600'}`}
                    dangerouslySetInnerHTML={{ __html: copy.subheadline }}
                />

                <div className="group relative aspect-video w-full overflow-hidden rounded-2xl border-2 border-white/10 shadow-2xl md:rounded-[3rem] md:border-4">
                    <img
                        src={heroImage}
                        alt="Hero"
                        className={`h-full w-full object-cover transition-all duration-1000 ${salesPage.settings?.image_filters?.grayscale ? 'grayscale' : ''} ${salesPage.settings?.image_filters?.invert ? 'invert' : ''} ${salesPage.settings?.image_filters?.sepia ? 'sepia' : ''} ${isDarkTech && !salesPage.settings?.image_filters ? 'brightness-50 contrast-150 grayscale invert' : ''}`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>

                <button
                    onClick={handleCtaClick}
                    className={`transform rounded-full px-10 py-5 text-xl font-black shadow-2xl transition-all hover:scale-105 active:scale-95 md:px-16 md:py-7 md:text-2xl ${isCorporate ? 'bg-blue-900 text-white' : isMinimal ? 'bg-slate-900 text-white' : isDarkTech ? 'bg-green-500 text-black' : isVibrant ? 'bg-gradient-to-r from-indigo-500 via-purple-600 to-fuchsia-600 text-white shadow-fuchsia-500/20' : 'bg-indigo-600 text-white'}`}
                    dangerouslySetInnerHTML={{ __html: copy.cta }}
                />
            </header>

            <section
                className={`py-20 md:py-40 ${isCorporate || isMinimal ? 'bg-slate-50' : isDarkTech ? 'border-y border-green-500/20 bg-white/5' : 'bg-white/5'}`}
            >
                <div className="mx-auto grid max-w-5xl grid-cols-1 gap-12 px-6 md:grid-cols-2 md:gap-20">
                    <div>
                        <h4
                            className={`mb-4 text-[10px] font-black uppercase tracking-[0.3em] md:mb-6 md:text-[11px] ${isDarkTech ? 'text-green-500' : 'text-red-500'}`}
                        >
                            The Pain Point
                        </h4>
                        <p
                            className="text-xl leading-relaxed md:text-2xl"
                            dangerouslySetInnerHTML={{ __html: copy.problem }}
                        />
                    </div>
                    <div>
                        <h4
                            className={`mb-4 text-[10px] font-black uppercase tracking-[0.3em] md:mb-6 md:text-[11px] ${isDarkTech ? 'text-green-300' : 'text-green-500'}`}
                        >
                            The Solution
                        </h4>
                        <p
                            className="text-xl leading-relaxed md:text-2xl"
                            dangerouslySetInnerHTML={{ __html: copy.solution }}
                        />
                    </div>
                </div>
            </section>

            {/* Benefits Grid */}
            <section className="mx-auto max-w-6xl px-6 py-20 md:py-40">
                <div className="grid grid-cols-1 gap-12 text-left md:grid-cols-2 md:gap-20">
                    {copy.benefits.map((benefit: string, i: number) => {
                        const words = benefit.split(' ');
                        const title = words.slice(0, 3).join(' ');
                        const desc = words.slice(3).join(' ');
                        return (
                            <div
                                key={i}
                                className="group flex flex-row items-start space-x-6 md:space-x-10"
                            >
                                <div
                                    className={`flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl text-xl font-black text-white shadow-xl transition-transform group-hover:scale-110 md:h-20 md:w-20 md:rounded-[2.5rem] md:text-2xl ${isDarkTech ? 'bg-green-600 shadow-green-500/20' : 'bg-indigo-600 shadow-indigo-600/20'}`}
                                >
                                    {benefit.charAt(0)}
                                </div>
                                <div className="space-y-3">
                                    <h4 className="text-xl font-black tracking-tight md:text-3xl">
                                        {title}
                                    </h4>
                                    <p className="text-base leading-relaxed opacity-60 md:text-lg">
                                        {desc}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Features Breakdown */}
            <section
                className={`py-20 md:py-40 ${isCorporate || isMinimal ? 'bg-slate-50' : 'bg-white/5'}`}
            >
                <div className="mx-auto max-w-6xl px-6">
                    <div className="grid grid-cols-1 gap-12 text-left md:grid-cols-2 md:gap-20">
                        {copy.features_breakdown.map((f: any, i: number) => (
                            <div
                                key={i}
                                className="group flex space-x-6 md:space-x-10"
                            >
                                <div
                                    className={`flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl text-xl font-black text-white shadow-xl md:h-20 md:w-20 md:rounded-[2.5rem] md:text-2xl ${isDarkTech ? 'bg-green-600 shadow-green-500/20' : 'bg-indigo-600 shadow-indigo-600/20'}`}
                                >
                                    {f.title.charAt(0)}
                                </div>
                                <div className="space-y-3">
                                    <h4 className="text-xl font-black tracking-tight md:text-3xl">
                                        {f.title}
                                    </h4>
                                    <p className="text-base leading-relaxed opacity-60 md:text-lg">
                                        {f.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            {salesPage.settings?.visible_sections?.testimonials &&
                copy.testimonials && (
                    <section className="mx-auto max-w-6xl px-6 py-20 md:py-40">
                        <h3
                            className={`mb-12 text-center text-[10px] font-black uppercase tracking-[0.4em] md:mb-20 ${isDarkTech ? 'text-green-500' : 'text-gray-400'}`}
                        >
                            What People Say
                        </h3>
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-10">
                            {copy.testimonials.map((t: any, i: number) => (
                                <div
                                    key={i}
                                    className={`rounded-2xl border p-8 md:rounded-[3.5rem] md:p-12 ${isDarkTech ? 'border-green-500/20 bg-white/5 text-green-400' : 'border-slate-100 bg-white shadow-sm'}`}
                                >
                                    <p className="mb-6 text-base italic leading-relaxed md:text-lg">
                                        "{t.content}"
                                    </p>
                                    <div className="flex items-center space-x-4">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-500/10 text-xl font-bold text-indigo-600">
                                            {t.name[0]}
                                        </div>
                                        <div>
                                            <div className="text-base font-bold">
                                                {t.name}
                                            </div>
                                            <div className="text-[10px] font-black uppercase tracking-widest opacity-50">
                                                {t.role}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

            {/* FAQ */}
            {salesPage.settings?.visible_sections?.faq && copy.faq && (
                <section className="mx-auto max-w-4xl px-6 py-20 md:py-40">
                    <h3
                        className={`mb-12 text-center text-[10px] font-black uppercase tracking-[0.4em] md:mb-20 ${isDarkTech ? 'text-green-500' : 'text-gray-400'}`}
                    >
                        Common Questions
                    </h3>
                    <div className="space-y-6 md:space-y-8">
                        {copy.faq.map((f: any, i: number) => (
                            <div
                                key={i}
                                className={`rounded-2xl border p-8 md:rounded-[3rem] md:p-10 ${isDarkTech ? 'border-green-500/20 bg-black' : 'border-slate-100 bg-white shadow-sm'}`}
                            >
                                <div className="mb-4 flex items-center space-x-4 text-xl font-black text-indigo-500 md:mb-5 md:text-2xl">
                                    <span className="opacity-30">Q:</span>
                                    <span
                                        className={
                                            isDarkTech
                                                ? 'text-green-400'
                                                : 'text-slate-900'
                                        }
                                    >
                                        {f.question}
                                    </span>
                                </div>
                                <div className="text-base leading-relaxed opacity-60 md:ml-12 md:text-lg">
                                    {f.answer}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            <section className="px-6 py-20 md:py-40">
                <div
                    className={`relative mx-auto max-w-5xl overflow-hidden rounded-[3rem] p-12 text-center shadow-2xl md:rounded-[5rem] md:p-32 ${isMinimal ? 'bg-slate-900 text-white' : isCorporate ? 'bg-blue-950 text-white' : isDarkTech ? 'border-4 border-green-500 bg-black text-green-500 shadow-[0_0_50px_rgba(34,197,94,0.2)]' : 'bg-indigo-950 text-white shadow-[0_50px_100px_-20px_rgba(79,70,229,0.3)]'}`}
                >
                    <h2 className="mb-10 text-3xl font-bold uppercase tracking-widest opacity-80 md:text-4xl">
                        Start Your Journey
                    </h2>
                    <div
                        className="mb-12 text-7xl font-black leading-none tracking-tighter md:mb-16 md:text-[10rem]"
                        dangerouslySetInnerHTML={{
                            __html: copy.pricing_display,
                        }}
                    />
                    <p
                        className="mx-auto mb-12 max-w-2xl text-lg leading-relaxed opacity-60 md:mb-20 md:text-3xl"
                        dangerouslySetInnerHTML={{
                            __html: copy.social_proof_placeholder,
                        }}
                    />
                    <button
                        onClick={handleCtaClick}
                        className={`transform rounded-full bg-white px-12 py-6 text-xl font-black transition-all hover:scale-110 active:scale-95 md:px-20 md:py-8 md:text-3xl ${isDarkTech ? 'text-black' : 'text-indigo-900'}`}
                        dangerouslySetInnerHTML={{ __html: copy.cta }}
                    />
                </div>
            </section>

            <footer className="flex flex-col items-center space-y-4 border-t border-white/5 py-12 opacity-30">
                <div className="flex items-center space-x-2 text-sm">
                    <span>Built with</span>
                    <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                    <span>using MarketAI</span>
                </div>
            </footer>

            {/* Sticky Mobile CTA */}
            <div className="fixed bottom-6 left-6 right-6 z-[100] lg:hidden">
                <button
                    onClick={handleCtaClick}
                    className="flex w-full items-center justify-center space-x-3 rounded-2xl border border-white/20 bg-gradient-to-r from-indigo-600 to-fuchsia-600 py-5 text-xl font-black text-white shadow-2xl shadow-indigo-600/40 backdrop-blur-xl transition-all active:scale-95"
                >
                    <MessageSquare className="h-6 w-6" />
                    <span dangerouslySetInnerHTML={{ __html: copy.cta }} />
                </button>
            </div>
        </div>
    );
}
