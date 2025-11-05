import { useEffect, useRef } from 'react'

function SpectrumAnalyzer({ audioEngine, isPlaying }) {
  const canvasRef = useRef(null)
  const animationFrameRef = useRef(null)

  useEffect(() => {
    if (!audioEngine || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const width = canvas.width
    const height = canvas.height

    const draw = () => {
      const frequencyData = audioEngine.getFrequencyData()
      
      if (!frequencyData) {
        // Draw empty state
        ctx.fillStyle = 'rgba(10, 10, 26, 0.95)'
        ctx.fillRect(0, 0, width, height)
        
        // Grid
        ctx.strokeStyle = 'rgba(99, 102, 241, 0.1)'
        ctx.lineWidth = 1
        for (let i = 0; i < 10; i++) {
          const y = (height / 10) * i
          ctx.beginPath()
          ctx.moveTo(0, y)
          ctx.lineTo(width, y)
          ctx.stroke()
        }
        
        // Center text
        ctx.fillStyle = 'rgba(156, 163, 175, 0.5)'
        ctx.font = '14px monospace'
        ctx.textAlign = 'center'
        ctx.fillText('Audio not loaded', width / 2, height / 2)
        
        animationFrameRef.current = requestAnimationFrame(draw)
        return
      }

      // Clear with fade effect
      ctx.fillStyle = 'rgba(10, 10, 26, 0.3)'
      ctx.fillRect(0, 0, width, height)

      // Draw grid
      ctx.strokeStyle = 'rgba(99, 102, 241, 0.1)'
      ctx.lineWidth = 1
      
      // Horizontal lines (dB markers)
      for (let i = 0; i < 8; i++) {
        const y = (height / 8) * i
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(width, y)
        ctx.stroke()
      }

      // Vertical lines (frequency markers)
      const freqMarkers = [100, 500, 1000, 2000, 5000, 10000]
      freqMarkers.forEach(freq => {
        const x = (Math.log10(freq) - 2) / 3 * width
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, height)
        ctx.stroke()
      })

      // Draw frequency bars
      const barCount = 128
      const barWidth = width / barCount
      
      for (let i = 0; i < barCount; i++) {
        const value = frequencyData[i] || 0
        const percent = value / 255
        const barHeight = height * percent

        // Create gradient for each bar
        const gradient = ctx.createLinearGradient(0, height - barHeight, 0, height)
        
        if (percent > 0.8) {
          // Red zone (hot)
          gradient.addColorStop(0, '#ef4444')
          gradient.addColorStop(1, '#dc2626')
        } else if (percent > 0.6) {
          // Yellow zone (warm)
          gradient.addColorStop(0, '#f59e0b')
          gradient.addColorStop(1, '#d97706')
        } else {
          // Green zone (normal)
          gradient.addColorStop(0, '#8b5cf6')
          gradient.addColorStop(1, '#6366f1')
        }

        ctx.fillStyle = gradient
        ctx.fillRect(i * barWidth, height - barHeight, barWidth - 1, barHeight)

        // Add glow effect on peaks
        if (percent > 0.7) {
          ctx.shadowBlur = 10
          ctx.shadowColor = percent > 0.8 ? '#ef4444' : '#f59e0b'
        } else {
          ctx.shadowBlur = 0
        }
      }

      // Draw frequency labels
      ctx.fillStyle = 'rgba(156, 163, 175, 0.7)'
      ctx.font = '10px monospace'
      ctx.textAlign = 'center'
      ctx.shadowBlur = 0
      
      const labels = [
        { freq: '100Hz', x: (Math.log10(100) - 2) / 3 * width },
        { freq: '1kHz', x: (Math.log10(1000) - 2) / 3 * width },
        { freq: '10kHz', x: (Math.log10(10000) - 2) / 3 * width }
      ]
      
      labels.forEach(label => {
        ctx.fillText(label.freq, label.x, height - 5)
      })

      // Draw dB scale
      ctx.textAlign = 'right'
      for (let i = 0; i <= 4; i++) {
        const db = -60 + (i * 15)
        const y = height - (height / 4) * i
        ctx.fillText(`${db}dB`, width - 5, y + 4)
      }

      animationFrameRef.current = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [audioEngine, isPlaying])

  return (
    <div className="backdrop-blur-xl bg-gray-900/40 border border-gray-800/50 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold flex items-center gap-2">
          <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
          </svg>
          Spectrum Analyzer
        </h3>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-xs">
            <div className="w-3 h-3 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600"></div>
            <span className="text-gray-400">Normal</span>
          </div>
          <div className="flex items-center gap-1 text-xs">
            <div className="w-3 h-3 rounded-full bg-gradient-to-br from-orange-500 to-yellow-500"></div>
            <span className="text-gray-400">Warm</span>
          </div>
          <div className="flex items-center gap-1 text-xs">
            <div className="w-3 h-3 rounded-full bg-gradient-to-br from-red-500 to-red-600"></div>
            <span className="text-gray-400">Hot</span>
          </div>
        </div>
      </div>
      
      <div className="relative rounded-xl overflow-hidden border border-gray-800/50 bg-gray-950/50">
        <canvas
          ref={canvasRef}
          width={800}
          height={200}
          className="w-full h-[200px]"
        />
        
        {isPlaying && (
          <div className="absolute top-2 right-2 flex items-center gap-2 bg-red-500/20 backdrop-blur-sm border border-red-500/30 rounded-lg px-3 py-1">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-medium text-red-300">LIVE</span>
          </div>
        )}
      </div>

      <div className="mt-2 text-xs text-gray-500 text-center">
        Real-time frequency analysis • 20Hz - 20kHz
      </div>
    </div>
  )
}

export default SpectrumAnalyzer
