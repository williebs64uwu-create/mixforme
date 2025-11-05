import { useState } from 'react'
import { GitCompare, Volume2, VolumeX } from 'lucide-react'

function ABComparison({ 
  onToggle, 
  isProcessed, 
  currentMode = 'A',
  disabled = false 
}) {
  const [mode, setMode] = useState(currentMode)

  const handleToggle = () => {
    const newMode = mode === 'A' ? 'B' : 'A'
    setMode(newMode)
    onToggle(newMode)
  }

  const handleQuickSwitch = (selectedMode) => {
    setMode(selectedMode)
    onToggle(selectedMode)
  }

  return (
    <div className="backdrop-blur-xl bg-gray-900/40 border border-gray-800/50 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold flex items-center gap-2">
          <GitCompare className="w-5 h-5" />
          A/B Comparison
        </h3>
        {!isProcessed && (
          <span className="text-xs text-gray-500">Process audio first</span>
        )}
      </div>

      {/* Main Toggle Button */}
      <button
        onClick={handleToggle}
        disabled={disabled || !isProcessed}
        className={`w-full h-24 rounded-xl transition-all duration-300 relative overflow-hidden ${
          disabled || !isProcessed
            ? 'bg-gray-800/50 cursor-not-allowed'
            : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 cursor-pointer shadow-lg shadow-indigo-500/30'
        }`}
      >
        <div className="absolute inset-0 flex">
          {/* A Side (Original) */}
          <div 
            className={`flex-1 flex items-center justify-center transition-all duration-500 ${
              mode === 'A' ? 'bg-white/10 backdrop-blur-sm' : 'bg-transparent'
            }`}
          >
            <div className="text-center">
              <div className={`text-3xl font-bold transition-all ${
                mode === 'A' ? 'text-white scale-110' : 'text-white/50'
              }`}>
                A
              </div>
              <div className={`text-xs mt-1 transition-all ${
                mode === 'A' ? 'text-white' : 'text-white/50'
              }`}>
                Original
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="w-px bg-white/20" />

          {/* B Side (Processed) */}
          <div 
            className={`flex-1 flex items-center justify-center transition-all duration-500 ${
              mode === 'B' ? 'bg-white/10 backdrop-blur-sm' : 'bg-transparent'
            }`}
          >
            <div className="text-center">
              <div className={`text-3xl font-bold transition-all ${
                mode === 'B' ? 'text-white scale-110' : 'text-white/50'
              }`}>
                B
              </div>
              <div className={`text-xs mt-1 transition-all ${
                mode === 'B' ? 'text-white' : 'text-white/50'
              }`}>
                Processed
              </div>
            </div>
          </div>
        </div>

        {/* Active indicator */}
        <div 
          className="absolute bottom-0 h-1 bg-white shadow-lg shadow-white/50 transition-all duration-300"
          style={{
            left: mode === 'A' ? '0%' : '50%',
            width: '50%'
          }}
        />
      </button>

      {/* Quick Switch Buttons */}
      <div className="grid grid-cols-2 gap-3 mt-4">
        <button
          onClick={() => handleQuickSwitch('A')}
          disabled={disabled || !isProcessed}
          className={`py-3 px-4 rounded-lg font-medium text-sm transition-all duration-200 ${
            mode === 'A'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
              : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <div className="flex items-center justify-center gap-2">
            <Volume2 className="w-4 h-4" />
            Original
          </div>
        </button>
        <button
          onClick={() => handleQuickSwitch('B')}
          disabled={disabled || !isProcessed}
          className={`py-3 px-4 rounded-lg font-medium text-sm transition-all duration-200 ${
            mode === 'B'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
              : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <div className="flex items-center justify-center gap-2">
            <VolumeX className="w-4 h-4" />
            Processed
          </div>
        </button>
      </div>

      {/* Info tip */}
      <div className="mt-4 p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-lg">
        <p className="text-xs text-indigo-300">
          💡 <strong>Tip:</strong> Click the main button or use quick switches to compare your original audio with the processed version.
        </p>
      </div>

      {/* Keyboard shortcut hint */}
      {isProcessed && (
        <div className="mt-3 text-center">
          <span className="text-xs text-gray-500">
            Press <kbd className="px-2 py-1 bg-gray-800 rounded text-xs font-mono">Space</kbd> to toggle
          </span>
        </div>
      )}
    </div>
  )
}

export default ABComparison
