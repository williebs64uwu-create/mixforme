import { useState, useEffect, useRef } from 'react'
import { Play, Pause, Volume2, VolumeX } from 'lucide-react'

function AudioPlayer({ audioEngine, preset, isProcessed, onPlayStateChange }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.7)
  const [isMuted, setIsMuted] = useState(false)
  
  const startTimeRef = useRef(0)
  const playStartTimeRef = useRef(0)
  const animationFrameRef = useRef(null)

  useEffect(() => {
    if (audioEngine?.audioBuffer) {
      setDuration(audioEngine.audioBuffer.duration)
    }
  }, [audioEngine?.audioBuffer])

  useEffect(() => {
    if (audioEngine) {
      audioEngine.updateVolume(isMuted ? 0 : volume)
    }
  }, [volume, isMuted, audioEngine])

  const updateTime = () => {
    const elapsed = (audioEngine.audioContext.currentTime - playStartTimeRef.current)
    const newTime = startTimeRef.current + elapsed
    
    if (newTime >= duration) {
      setIsPlaying(false)
      setCurrentTime(0)
      if (onPlayStateChange) onPlayStateChange(false)
      return
    }
    
    setCurrentTime(newTime)
    animationFrameRef.current = requestAnimationFrame(updateTime)
  }

  const togglePlayPause = async () => {
    if (!audioEngine?.audioBuffer || !preset) return

    // Resume context if needed
    await audioEngine.resumeContext()

    if (isPlaying) {
      audioEngine.stop()
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      startTimeRef.current = currentTime
    } else {
      audioEngine.play(preset)
      playStartTimeRef.current = audioEngine.audioContext.currentTime
      startTimeRef.current = currentTime
      animationFrameRef.current = requestAnimationFrame(updateTime)
    }
    
    const newState = !isPlaying
    setIsPlaying(newState)
    if (onPlayStateChange) onPlayStateChange(newState)
  }

  const handleSeek = (e) => {
    const seekTime = parseFloat(e.target.value)
    setCurrentTime(seekTime)
    startTimeRef.current = seekTime
    
    if (isPlaying && audioEngine && preset) {
      audioEngine.stop()
      audioEngine.playFrom(preset, seekTime)
      playStartTimeRef.current = audioEngine.audioContext.currentTime
    }
  }

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume)
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const formatTime = (time) => {
    if (isNaN(time)) return '0:00'
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <div className="backdrop-blur-xl bg-gray-900/40 border border-gray-800/50 rounded-2xl p-6">
      <h3 className="text-white font-semibold mb-4">Audio Player</h3>
      
      {/* Waveform visualization placeholder */}
      <div className="h-32 bg-gradient-to-r from-indigo-950/50 to-purple-950/50 rounded-xl flex items-center justify-center border border-gray-800/30 mb-4 relative overflow-hidden">
        {audioEngine?.audioBuffer ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex gap-1 items-end h-24">
              {[...Array(50)].map((_, i) => (
                <div
                  key={i}
                  className="w-1 bg-gradient-to-t from-indigo-500 to-purple-500 rounded-full transition-all"
                  style={{
                    height: `${20 + Math.random() * 80}%`,
                    opacity: i / 50 < (currentTime / duration) ? 1 : 0.3
                  }}
                />
              ))}
            </div>
          </div>
        ) : (
          <p className="text-gray-600">Upload audio to see waveform</p>
        )}
      </div>
      
      {/* Playback Controls */}
      <div className="space-y-4">
        {/* Progress Bar */}
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-400 w-12">{formatTime(currentTime)}</span>
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            disabled={!vocalFile}
            className="flex-1"
          />
          <span className="text-sm text-gray-400 w-12">{formatTime(duration)}</span>
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Play/Pause Button */}
            <button
              onClick={togglePlayPause}
              disabled={!audioEngine?.audioBuffer}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 ${
                audioEngine?.audioBuffer
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500'
                  : 'bg-gray-700 cursor-not-allowed'
              }`}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 text-white" />
              ) : (
                <Play className="w-5 h-5 text-white ml-1" />
              )}
            </button>

            {/* Track Info */}
            <div>
              <p className="text-sm text-white font-medium">
                {audioEngine?.audioBuffer ? 'Vocal Track' : 'No audio loaded'}
              </p>
              {isProcessed && (
                <p className="text-xs text-green-400">
                  ✓ Processed
                </p>
              )}
            </div>
          </div>

          {/* Volume Control */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleMute}
              className="w-8 h-8 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 flex items-center justify-center transition-colors"
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4 text-gray-400" />
              ) : (
                <Volume2 className="w-4 h-4 text-gray-400" />
              )}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className="w-24"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default AudioPlayer
