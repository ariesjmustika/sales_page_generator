import { Heart } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="mt-auto w-full border-t border-white/5 px-4 py-8">
            <div className="mx-auto flex max-w-7xl flex-col items-center justify-center space-y-2">
                <div className="flex items-center space-x-2 text-sm font-medium text-gray-400">
                    <span>Built with</span>
                    <Heart className="h-4 w-4 animate-pulse fill-red-500 text-red-500" />
                    <span>by</span>
                    <a
                        href="https://ariesjakaradytia.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-white transition-colors hover:text-indigo-400"
                    >
                        Aries Jakaradytia Mustika
                    </a>
                    <span className="text-gray-600">—</span>
                    <span className="text-gray-500">2026</span>
                </div>
                <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-600">
                    MarketAI Platform
                </div>
            </div>
        </footer>
    );
}
