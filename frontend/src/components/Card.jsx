export default function Card({ title, icon, action, children, className = "" }) {
  return (
    <div className={`bg-surface border border-border rounded-lg p-5 ${className}`}>
      {(title || action) && (
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {icon}
            {title && <h3 className="font-medium text-ink">{title}</h3>}
          </div>
          {action}
        </div>
      )}
      {children}
    </div>
  );
}