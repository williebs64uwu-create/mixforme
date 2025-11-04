import { Sliders, RotateCcw } from 'lucide-react'

function ControlPanel({ 
  preset, 
  onEQChange, 
  onCompressionChange,
  onReset,
  disabled 
}) {
  
  const handleLowChange = (e) => {
    const value = parseFloat(e.target.value)
    onEQChange('low', value)
  }

  const handleMidChange = (e) => {
    const value = parseFloat(e.target.value)
    onEQChange('mid', value)
  }

  const handleHighChange = (e) => {
    const value = parseFloat(e.target.value)
    onEQChange('high', value)
  }

  const handleCompressionChange = (e) => {
    const value = parseInt(e.target.value)
    onCompressionChange(value)
  }

  return (
    <div className="backdrop-blur-xl bg-gray-900/40 border border-gray-800/50 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold flex items-center gap-2">
          <Sliders className="w-5 h-5" />
          Audio Controls
        </h3>
        <button
          onClick={onReset}
          disabled={disabled}
          className="px-3 py-1.5 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 text-gray-400 hover:text-white text-sm transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </button>
      </div>

      <div className="space-y-6">
        {/* EQ Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-300">Equalizer</h4>
            <span className="text-xs text-gray-500">3-Band EQ</span>
          </div>

          {/* Low Frequency */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm text-gray-400">Low (Bass)</label>
              <span className="text-xs text-indigo-400 font-mono">
                {preset?.settings.eq.low > 0 ? '+' : ''}{preset?.settings.eq.low.toFixed(1)} dB
              </span>
            </div>
            <div className="relative">
              <input
                type="range"
                min="-12"
                max="12"
                step="0.5"
                value={preset?.settings.eq.low || 0}
                onChange={handleLowChange}
                disabled={disabled}
                className="w-full disabled:opacity-50"
              />
              <div className="flex justify-between text-xs text-gray-600 mt-1">
                <span>-12</span>
                <span>0</span>
                <span>+12</span>
              </div>
            </div>
          </div>

          {/* Mid Frequency */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm text-gray-400">Mid (Presence)</label>
              <span className="text-xs text-purple-400 font-mono">
                {preset?.settings.eq.mid > 0 ? '+' : ''}{preset?.settings.eq.mid.toFixed(1)} dB
              </span>
            </div>
            <div className="relative">
              <input
                type="range"
                min="-12"
                max="12"
                step="0.5"
                value={preset?.settings.eq.mid || 0}
                onChange={handleMidChange}
                disabled={disabled}
                className="w-full disabled:opacity-50"
              />
              <div className="flex justify-between text-xs text-gray-600 mt-1">
                <span>-12</span>
                <span>0</span>
                <span>+12</span>
              </div>
            </div>
          </div>

          {/* High Frequency */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm text-gray-400">High (Air)</label>
              <span className="text-xs text-pink-400 font-mono">
                {preset?.settings.eq.high > 0 ? '+' : ''}{preset?.settings.eq.high.toFixed(1)} dB
              </span>
            </div>
            <div className="relative">
              <input
                type="range"
                min="-12"
                max="12"
                step="0.5"
                value={preset?.settings.eq.high || 0}
                onChange={handleHighChange}
                disabled={disabled}
                className="w-full disabled:opacity-50"
              />
              <div className="flex justify-between text-xs text-gray-600 mt-1">
                <span>-12</span>
                <span>0</span>
                <span>+12</span>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800/50"></div>

        {/* Dynamics Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-300">Dynamics</h4>
            <span className="text-xs text-gray-500">Compression</span>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm text-gray-400">Compression Amount</label>
              <span className="text-xs text-indigo-400 font-mono">
                {Math.round((preset?.settings.compressor.ratio || 4) * 10)}%
              </span>
            </div>
            <div className="relative">
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                defaultValue="60"
                onChange={handleCompressionChange}
                disabled={disabled}
                className="w-full disabled:opacity-50"
              />
              <div className="flex justify-between text-xs text-gray-600 mt-1">
                <span>Light</span>
                <span>Medium</span>
                <span>Heavy</span>
              </div>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-3">
          <p className="text-xs text-indigo-300">
            💡 <strong>Tip:</strong> Adjust EQ to shape your vocal tone. Low = warmth, Mid = presence, High = clarity.
          </p>
        </div>
      </div>
    </div>
  )
}

export default ControlPanel
