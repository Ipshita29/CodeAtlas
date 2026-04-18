export const Card = ({ title, children, className = "" }) => {
  return (
    <div className={`bg-[#131313] border-l-4 border-[#ff8f6f] p-6 relative overflow-hidden ${className}`}>
      {title && (
        <div className="mb-4">
          <h3 className="text-[#ff8f6f] text-xs font-mono tracking-widest opacity-80 mb-1">
            {title}
          </h3>
          <div className="h-[1px] bg-white opacity-10 w-full"></div>
        </div>
      )}
      {children}
      <div className="absolute bottom-1 right-2 opacity-10 font-mono text-[8px]">
        UNIT_ID: CA-DASH-2026
      </div>
    </div>
  );
};
