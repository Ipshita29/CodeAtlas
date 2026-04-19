export const Card = ({ title, children, className = "", id = "" }) => {
  return (
    <div className={`card ${className}`}>
      {title && (
        <div className="mb-8">
          <div className="mono-label" style={{ fontSize: '10px', marginBottom: '4px', opacity: 0.4 }}>SECTION</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <h3 style={{ fontSize: '1.25rem', color: '#fff' }}>{title}</h3>
            {id && <span className="mono-label" style={{ fontSize: '8px', opacity: 0.2 }}>{id}</span>}
          </div>
        </div>
      )}
      <div className="card-content">
        {children}
      </div>
    </div>
  );
};
