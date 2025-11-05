import { useEffect, useState, useRef } from 'react'

function VUMeter({ audioEngine, isPlaying, label = 'OUTPUT' }) {
  const [level, setLevel] = useState(0)
  const [peak, setPeak] = useState(0)
  const animationFrameRef = useRef(null)
  const peakHoldTimeoutRef = useRef(null)

  useEffect(() => {
    if (!audioEngine || !isPlaying) {
      setLevel(0)
      return
    }

    const updateMeter = () => {
      const frequencyData = audioEngine.getFrequencyData()
      
      if (frequencyData) {
        // Calculate RMS level
        let sum = 0
        for (let i = 0; i < frequencyData.length; i++) {
          sum += frequencyData[i] * frequencyData[i]
        }
        const rms = Math.sqrt(sum / frequencyData.length)
        const db = 20 * Math.log10(rms / 255)
        const normalizedLevel = Math.max(0, Math.min(100, ((db + 60) / 60) * 100))
        
        setLevel(normalizedLevel)

        // Update peak hold
        if (normalizedLevel > peak) {
          setPeak(normalizedLevel)
          
          // Reset peak hold after 2 seconds
          if (peakHoldTimeoutRef.current) {
            clearTimeout(peakHoldTimeoutRef.current)
          }
          peakHoldTimeoutRef.current = setTimeout(() => {
            setPeak(0)
          }, 2000)
        }
      }

      animationFrameRef.current = requestAnimationFrame(updateMeter)
    }

    updateMeter()

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      if (peakHoldTimeoutRef.current) {
        clearTimeout(peakHoldTimeoutRef.current)
      }
    }
  }, [audioEngine, isPlaying, peak])

  const getSegmentColor = (index) => {
    if (index > 85) return 'bg-red-500'
    if (index > 70) return 'bg-yellow-500'
    if (index > 50) return 'bg-green-400'
    return 'bg-green-500'
  }

  const segments = Array.from({ length: 100 }, (_, i) => i)

  return (
    <div className="backdrop-blur-xl bg-gray-900/40 border border-gray-800/50 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-gray-400 tracking-wider">{label}</span>
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-gray-500">
            {level > 0 ? `${((level - 100) * 0.6).toFixed(1)}dB` : '-∞'}
          </span>
          {peak > 85 && (
            <div className="flex items-center gap-1 bg-red-500/20 rounded px-2 py-0.5">
              <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-bold text-red-400">CLIP</span>
            </div>
          )}
        </div>
      </div>

      {/* Horizontal meter bar */}
      <div className="relative h-8 bg-gray-950/50 rounded-lg overflow-hidden border border-gray-800/30">
        <div className="absolute inset-0 flex">
          {segments.map((i) => (
            <div
              key={i}
              className={`flex-1 transition-all duration-75 ${
                i < level ? getSegmentColor(i) : 'bg-gray-800/30'
              } ${i < level ? 'opacity-100' : 'opacity-50'}`}
              style={{
                boxShadow: i < level && i > 85 ? '0 0 10px rgba(239, 68, 68, 0.5)' : 'none'
              }}
            />
          ))}
        </div>

        {/* Peak hold indicator */}
        {peak > 0 && (
          <div
            className="absolute top-0 w-0.5 h-full bg-white shadow-lg shadow-white/50 transition-all duration-100"
            style={{ left: `${peak}%` }}
          />
        )}

        {/* dB markers */}
        <div className="absolute inset-x-0 bottom-0 flex justify-between px-1 pb-0.5 pointer-events-none">
          {[-60, -40, -20, -10, -6, -3, 0].map((db) => (
            <div key={db} className="relative">
              <div className="absolute bottom-0 w-px h-2 bg-gray-600/50" />
              <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[8px] text-gray-600 font-mono whitespace-nowrap">
                {db}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Mini stereo meters (decorative) */}
      <div className="flex gap-2 mt-3">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] text-gray-600">L</span>
            <span className="text-[10px] font-mono text-gray-600">
              {level > 0 ? `${((level - 100) * 0.6).toFixed(0)}` : '-∞'}
            </span>
          </div>
          <div className="h-1.5 bg-gray-950/50 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 transition-all duration-75"
              style={{ width: `${level}%` }}
            />
          </div>
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] text-gray-600">R</span>
            <span className="text-[10px] font-mono text-gray-600">
              {level > 0 ? `${((level - 100) * 0.6 - 1).toFixed(0)}` : '-∞'}
            </span>
          </div>
          <div className="h-1.5 bg-gray-950/50 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 transition-all duration-75"
              style={{ width: `${Math.max(0, level - 2)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default VUMeter
