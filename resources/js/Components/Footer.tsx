import React from 'react';
import { Heart } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="w-full py-8 px-4 mt-auto border-t border-white/5">
            <div className="max-w-7xl mx-auto flex flex-col items-center justify-center space-y-2">
                <div className="flex items-center space-x-2 text-sm font-medium text-gray-400">
                    <span>Built with</span>
                    <Heart className="w-4 h-4 text-red-500 fill-red-500 animate-pulse" />
                    <span>by</span>
                    <a 
                        href="https://ariesjakaradytia.com" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-white hover:text-indigo-400 transition-colors font-semibold"
                    >
                        Aries Jakaradytia Mustika
                    </a>
                    <span className="text-gray-600">—</span>
                    <span className="text-gray-500">2026</span>
                </div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-gray-600 font-bold">
                    MarketAI Platform
                </div>
            </div>
        </footer>
    );
}
