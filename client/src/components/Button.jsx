export default function Button({ children, className = '', variant = 'primary', ...props }) {
  const variants = {
    primary: 'bg-cyan-400 text-slate-950 hover:bg-cyan-300',
    secondary: 'border border-white/15 bg-white/5 text-white hover:bg-white/10',
    danger: 'bg-rose-500 text-white hover:bg-rose-400'
  };

  return (
    <button
      className={`inline-flex items-center justify-center rounded-2xl px-5 py-3 font-semibold ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
