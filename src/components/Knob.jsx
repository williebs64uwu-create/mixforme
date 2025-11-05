import { useState, useRef, useEffect } from 'react'

function Knob({ 
  label, 
  value, 
  min = 0, 
  max = 100, 
  step = 1,
  unit = '',
  onChange,
  color = 'indigo',
  disabled = false
}) {
  const [isDragging, setIsDragging] = useState(false)
  const [displayValue, setDisplayValue] = useState(value)
  const startYRef = useRef(0)
  const startValueRef = useRef(value)

  useEffect(() => {
    setDisplayValue(value)
  }, [value])

  const getRotation = (val) => {
    const percentage = (val - min) / (max - min)
    return -135 + (percentage * 270) // -135° to +135° (270° range)
  }

  const handleMouseDown = (e) => {
    if (disabled) return
    setIsDragging(true)
    startYRef.current = e.clientY
    startValueRef.current = value
    e.preventDefault()
  }

  const handleMouseMove = (e) => {
    if (!isDragging) return

    const deltaY = startYRef.current - e.clientY
    const range = max - min
    const sensitivity = range / 150 // Adjust sensitivity
    const newValue = Math.max(min, Math.min(max, startValueRef.current + (deltaY * sensitivity)))
    const steppedValue = Math.round(newValue / step) * step
    
    setDisplayValue(steppedValue)
    onChange(steppedValue)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging])

  const rotation = getRotation(displayValue)
  
  const colorClasses = {
    indigo: 'from-indigo-500 to-purple-600',
    purple: 'from-purple-500 to-pink-600',
    blue: 'from-blue-500 to-cyan-600',
    green: 'from-green-500 to-emerald-600',
    orange: 'from-orange-500 to-red-600',
  }

  const glowColors = {
    indigo: 'shadow-indigo-500/50',
    purple: 'shadow-purple-500/50',
    blue: 'shadow-blue-500/50',
    green: 'shadow-green-500/50',
    orange: 'shadow-orange-500/50',
  }

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Knob */}
      <div 
        className={`relative w-20 h-20 rounded-full cursor-pointer select-none transition-all ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
        } ${isDragging ? 'scale-105' : ''}`}
        onMouseDown={handleMouseDown}
      >
        {/* Outer ring */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 shadow-lg">
          {/* Arc track */}
          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke="rgba(75, 85, 99, 0.3)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray="197 197"
              strokeDashoffset="49"
            />
            {/* Active arc */}
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray="197 197"
              strokeDashoffset={49 + (197 * (1 - (displayValue - min) / (max - min)))}
              className="transition-all duration-100"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Inner knob */}
        <div 
          className={`absolute inset-2 rounded-full bg-gradient-to-br ${colorClasses[color]} shadow-xl ${
            isDragging ? `shadow-2xl ${glowColors[color]}` : ''
          }`}
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          {/* Indicator line */}
          <div className="absolute top-1 left-1/2 -translate-x-1/2 w-0.5 h-6 bg-white rounded-full shadow-lg" />
          
          {/* Center dot */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-gray-900/30 backdrop-blur-sm" />
          </div>
        </div>

        {/* Markers */}
        <div className="absolute inset-0">
          {[0, 25, 50, 75, 100].map((tick) => {
            const angle = -135 + ((tick / 100) * 270)
            return (
              <div
                key={tick}
                className="absolute top-1/2 left-1/2 w-px h-1 bg-gray-700"
                style={{
                  transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-38px)`,
                  transformOrigin: 'center'
                }}
              />
            )
          })}
        </div>
      </div>

      {/* Label and Value */}
      <div className="text-center">
        <div className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">
          {label}
        </div>
        <div className={`text-sm font-bold bg-gradient-to-r ${colorClasses[color]} bg-clip-text text-transparent`}>
          {displayValue > 0 ? '+' : ''}{displayValue.toFixed(step < 1 ? 1 : 0)}{unit}
        </div>
      </div>
    </div>
  )
}

export default Knob
