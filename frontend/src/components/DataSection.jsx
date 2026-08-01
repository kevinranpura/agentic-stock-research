const DataSection = ({ title, icon, children }) => {
  return (
    <div className="bg-gradient-to-br from-dark-800/50 to-dark-900/50 border border-slate-700/50 rounded-2xl p-6 backdrop-blur-sm">
      <div className="flex items-center gap-2 mb-4 pb-4 border-b border-slate-700/30">
        <div className="w-8 h-8 bg-primary-500/20 rounded-lg flex items-center justify-center text-primary-400">
          {icon}
        </div>
        <h3 className="font-semibold text-white">{title}</h3>
      </div>
      {children}
    </div>
  )
}

export default DataSection
