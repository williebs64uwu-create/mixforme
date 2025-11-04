import { useEffect, useRef } from 'react'

function Waveform({ audioBuffer, isPlaying, currentTime, duration }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (!audioBuffer || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const width = canvas.width
    const height = canvas.height

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    // Get audio data
    const channelData = audioBuffer.getChannelData(0)
    const step = Math.ceil(channelData.length / width)
    const amp = height / 2

    // Create gradient
    const gradient = ctx.createLinearGradient(0, 0, width, 0)
    gradient.addColorStop(0, '#6366f1')
    gradient.addColorStop(0.5, '#8b5cf6')
    gradient.addColorStop(1, '#ec4899')

    // Draw waveform
    ctx.strokeStyle = gradient
    ctx.lineWidth = 2
    ctx.beginPath()

    for (let i = 0; i < width; i++) {
      const min = Math.min(...Array.from({ length: step }, (_, j) => channelData[i * step + j] || 0))
      const max = Math.max(...Array.from({ length: step }, (_, j) => channelData[i * step + j] || 0))
      
      const yMin = (1 + min) * amp
      const yMax = (1 + max) * amp

      if (i === 0) {
        ctx.moveTo(i, yMin)
      }
      ctx.lineTo(i, yMin)
      ctx.lineTo(i, yMax)
    }

    ctx.stroke()

    // Draw progress overlay
    if (duration > 0) {
      const progress = (currentTime / duration) * width
      ctx.fillStyle = 'rgba(99, 102, 241, 0.3)'
      ctx.fillRect(0, 0, progress, height)

      // Draw progress line
      ctx.strokeStyle = '#6366f1'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(progress, 0)
      ctx.lineTo(progress, height)
      ctx.stroke()
    }

  }, [audioBuffer, currentTime, duration])

  return (
    <div className="relative w-full h-32 bg-gradient-to-r from-indigo-950/50 to-purple-950/50 rounded-xl overflow-hidden border border-gray-800/30">
      {audioBuffer ? (
        <canvas
          ref={canvasRef}
          width={800}
          height={128}
          className="w-full h-full"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block w-12 h-12 rounded-full bg-gray-800/50 flex items-center justify-center mb-2">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
            </div>
            <p className="text-gray-600 text-sm">Upload audio to see waveform</p>
          </div>
        </div>
      )}
      
      {isPlaying && (
        <div className="absolute top-2 right-2">
          <div className="flex gap-1">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-1 bg-indigo-500 rounded-full animate-pulse"
                style={{
                  height: `${20 + Math.random() * 20}px`,
                  animationDelay: `${i * 0.15}s`
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Waveform
