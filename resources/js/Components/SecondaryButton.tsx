import { ButtonHTMLAttributes } from 'react';

export default function SecondaryButton({
    type = 'button',
    className = '',
    disabled,
    children,
    ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            {...props}
            type={type}
            className={
                `inline-flex items-center rounded-md border border-slate-300 dark:border-white/10 bg-white dark:bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-slate-700 dark:text-gray-300 shadow-sm transition duration-150 ease-in-out hover:bg-slate-50 dark:hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-25 ${
                    disabled && 'opacity-25'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
