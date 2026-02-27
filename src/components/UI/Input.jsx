export default function Input({ label, error, ...props }) {
    return (
        <div className="flex flex-col gap-1.5 w-full">
            {label && <label className="text-sm font-medium text-[var(--color-text-secondary)]">{label}</label>}
            <input 
                className="px-3 py-2.5 rounded-lg border border-[var(--color-border)] bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-all text-[var(--color-text-primary)]"
                {...props}
            />
            {error && <span className="text-xs text-[var(--color-danger)]">{error}</span>}
        </div>
    );
}