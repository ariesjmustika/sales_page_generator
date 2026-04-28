import { SVGAttributes } from 'react';

export default function ApplicationLogo(props: SVGAttributes<SVGElement>) {
    return (
        <svg
            {...props}
            viewBox="0 0 316 316"
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Market Chart line forming a professional motif */}
            <path
                d="M60 240 L110 140 L160 200 L210 80 L260 160"
                fill="none"
                stroke="currentColor"
                strokeWidth="28"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            {/* AI Connectivity Nodes */}
            <circle cx="60" cy="240" r="12" fill="currentColor" />
            <circle cx="110" cy="140" r="12" fill="currentColor" />
            <circle cx="160" cy="200" r="12" fill="currentColor" />
            <circle cx="210" cy="80" r="12" fill="currentColor" />
            <circle cx="260" cy="160" r="12" fill="currentColor" />
        </svg>
    );
}
