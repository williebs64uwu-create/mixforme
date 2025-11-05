import { Mic2, Sliders, Zap, Disc, Waves, Speaker } from 'lucide-react'

function ProcessingChain({ isProcessing, preset }) {
  const chain = [
    { 
      id: 'input', 
      icon: Mic2, 
      label: 'INPUT',
      color: 'from-gray-600 to-gray-700',
      active: true
    },
    { 
      id: 'eq', 
      icon: Sliders, 
      label: 'EQ',
      color: 'from-indigo-500 to-purple-600',
      active: preset?.settings.eq
    },
    { 
      id: 'comp', 
      icon: Zap, 
      label: 'COMP',
      color: 'from-purple-500 to-pink-600',
      active: preset?.settings.compressor
    },
    { 
      id: 'deess', 
      icon: Disc, 
      label: 'DE-ESS',
      color: 'from-blue-500 to-cyan-600',
      active: preset?.settings.deEsser
    },
    { 
      id: 'fx', 
      icon: Waves, 
      label: 'FX',
      color: 'from-green-500 to-emerald-600',
      active: preset?.settings.effects
    },
    { 
      id: 'output', 
      icon: Speaker, 
      label: 'OUT',
      color: 'from-orange-500 to-red-600',
      active: true
    }
  ]

  return (
    <div className="backdrop-blur-xl bg-gray-900/40 border border-gray-800/50 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold">Processing Chain</h3>
        {isProcessing && (
          <div className="flex items-center gap-2 bg-indigo-500/20 rounded-lg px-3 py-1 border border-indigo-500/30">
            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-medium text-indigo-300">ACTIVE</span>
          </div>
        )}
      </div>

      {/* Chain visualization */}
      <div className="relative">
        <div className="flex items-center justify-between gap-2">
          {chain.map((node, index) => (
            <div key={node.id} className="flex items-center flex-1">
              {/* Node */}
              <div className="relative group flex-1">
                <div 
                  className={`relative w-full aspect-square rounded-xl bg-gradient-to-br ${node.color} 
                    flex items-center justify-center transition-all duration-300
                    ${node.active ? 'opacity-100 shadow-lg' : 'opacity-30'}
                    ${isProcessing && node.active ? 'animate-pulse' : ''}
                    hover:scale-105 cursor-pointer`}
                >
                  <node.icon className="w-6 h-6 text-white" />
                  
                  {/* Glow effect when active */}
                  {isProcessing && node.active && (
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/20 to-transparent animate-pulse" />
                  )}

                  {/* Activity indicator */}
                  {node.active && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900 shadow-lg shadow-green-500/50" />
                  )}
                </div>

                {/* Label */}
                <div className="mt-2 text-center">
                  <span className={`text-xs font-semibold tracking-wider ${
                    node.active ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {node.label}
                  </span>
                </div>

                {/* Tooltip on hover */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                  <div className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white whitespace-nowrap shadow-xl">
                    {node.label}
                    <div className="text-gray-400 text-[10px] mt-0.5">
                      {node.active ? 'Active' : 'Inactive'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Arrow connector */}
              {index < chain.length - 1 && (
                <div className="flex items-center mx-1">
                  <div className={`h-0.5 w-4 transition-all duration-300 ${
                    isProcessing && node.active 
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-500 animate-pulse' 
                      : 'bg-gray-700'
                  }`}>
                    <div className={`h-full bg-gradient-to-r from-transparent via-white to-transparent ${
                      isProcessing && node.active ? 'animate-ping' : 'hidden'
                    }`} />
                  </div>
                  <div className={`w-0 h-0 border-l-4 border-y-4 border-y-transparent transition-colors ${
                    isProcessing && node.active ? 'border-l-purple-500' : 'border-l-gray-700'
                  }`} />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Signal flow animation */}
        {isProcessing && (
          <div className="absolute top-1/2 left-0 right-0 h-px overflow-hidden pointer-events-none">
            <div className="h-full w-8 bg-gradient-to-r from-transparent via-indigo-400 to-transparent animate-signal" />
          </div>
        )}
      </div>

      {/* Preset info */}
      {preset && (
        <div className="mt-4 p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{preset.emoji}</span>
              <div>
                <p className="text-sm font-medium text-white">{preset.name}</p>
                <p className="text-xs text-gray-400">Preset Active</p>
              </div>
            </div>
            <div className="text-xs text-gray-500 font-mono">
              {Object.keys(preset.settings).length} modules
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProcessingChain
