export default function Card({ children, className = '' }) {
    return (
        <div className={`bg-white rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-[var(--color-border)] p-5 ${className}`}>
            {children}
        </div>
    );
}