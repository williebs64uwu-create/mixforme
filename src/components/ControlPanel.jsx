import { Sliders, RotateCcw } from 'lucide-react'
import Knob from './Knob'

function ControlPanel({ 
  preset, 
  onEQChange, 
  onCompressionChange,
  onReset,
  disabled 
}) {
  
  const handleLowChange = (value) => {
    onEQChange('low', value)
  }

  const handleMidChange = (value) => {
    onEQChange('mid', value)
  }

  const handleHighChange = (value) => {
    onEQChange('high', value)
  }

  const handleCompressionChange = (value) => {
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
        {/* EQ Section with Knobs */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-medium text-gray-300">Equalizer</h4>
            <span className="text-xs text-gray-500">3-Band EQ</span>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Knob
              label="LOW"
              value={preset?.settings.eq.low || 0}
              min={-12}
              max={12}
              step={0.5}
              unit="dB"
              onChange={handleLowChange}
              color="indigo"
              disabled={disabled}
            />
            <Knob
              label="MID"
              value={preset?.settings.eq.mid || 0}
              min={-12}
              max={12}
              step={0.5}
              unit="dB"
              onChange={handleMidChange}
              color="purple"
              disabled={disabled}
            />
            <Knob
              label="HIGH"
              value={preset?.settings.eq.high || 0}
              min={-12}
              max={12}
              step={0.5}
              unit="dB"
              onChange={handleHighChange}
              color="blue"
              disabled={disabled}
            />
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800/50"></div>

        {/* Dynamics Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-medium text-gray-300">Dynamics</h4>
            <span className="text-xs text-gray-500">Compression</span>
          </div>

          <div className="flex justify-center">
            <Knob
              label="COMP"
              value={60}
              min={0}
              max={100}
              step={5}
              unit="%"
              onChange={handleCompressionChange}
              color="orange"
              disabled={disabled}
            />
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
