export default function Button({ children, variant = 'primary', className = '', ...props }) {
    const baseStyle = "px-4 py-2.5 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2";
    const variants = {
        primary: "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)]",
        outline: "border border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary-light)]",
        ghost: "text-[var(--color-text-secondary)] hover:bg-gray-100 hover:text-[var(--color-text-primary)]"
    };

    return (
        <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
            {children}
        </button>
    );
}