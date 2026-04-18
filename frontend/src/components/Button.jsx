export const Button = ({ children, variant = "primary", className = "", ...props }) => {
  const variantClass = `btn-${variant}`;
  
  return (
    <button 
      className={`btn ${variantClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
