export const Button = ({ children, variant = "primary", className = "", ...props }) => {
  const baseStyles = "px-6 py-3 uppercase font-black text-sm tracking-widest transition-all duration-200 active:scale-95";
  
  const variants = {
    primary: "bg-[#ff8f6f] text-black hover:shadow-[0_0_20px_rgba(255,143,111,0.4)]",
    secondary: "bg-transparent border border-[rgba(255,143,111,0.2)] text-[#ff8f6f] hover:border-[#ff8f6f]",
    ghost: "bg-transparent text-white opacity-60 hover:opacity-100",
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      style={{ border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
      {...props}
    >
      {children}
    </button>
  );
};
