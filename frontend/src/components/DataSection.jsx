const DataSection = ({ title, icon, accent = 'accent', children }) => {
  const chipStyles = {
    accent: 'bg-accent/15 text-accent',
    up: 'bg-up/15 text-up',
  }

  return (
    <div className="border border-line rounded-xl bg-surface-900 card-elevated p-5">
      <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-line">
        {icon && (
          <div
            className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
              chipStyles[accent] || chipStyles.accent
            }`}
          >
            {icon}
          </div>
        )}
        <h3 className="text-sm font-semibold text-ink">{title}</h3>
      </div>
      {children}
    </div>
  )
}

export default DataSection
