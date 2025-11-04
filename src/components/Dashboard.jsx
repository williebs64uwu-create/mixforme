import { useState } from 'react'
import Navbar from './Navbar'
import { Upload, Disc3, Play, Pause, Download, Sparkles, Sliders } from 'lucide-react'

function Dashboard() {
  const [isProcessing, setIsProcessing] = useState(false)
  const [selectedPreset, setSelectedPreset] = useState('rap')

  const presets = [
    { id: 'rap', name: 'Rap/Trap', emoji: '🎤', color: 'from-red-500 to-orange-500' },
    { id: 'pop', name: 'Pop/Singing', emoji: '🎵', color: 'from-pink-500 to-purple-500' },
    { id: 'podcast', name: 'Podcast', emoji: '🎙️', color: 'from-blue-500 to-cyan-500' },
    { id: 'rnb', name: 'R&B/Soul', emoji: '🎹', color: 'from-purple-500 to-indigo-500' },
    { id: 'rock', name: 'Rock/Metal', emoji: '🎸', color: 'from-orange-500 to-red-600' },
  ]

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold text-white mb-4">
            Mix Your Vocals Like a <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Pro</span>
          </h2>
          <p className="text-gray-400 text-lg">
            Upload your vocal and beat, choose a preset, and get studio-quality results in seconds
          </p>
        </div>

        {/* Main Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          
          {/* Upload Section */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Vocal Upload */}
            <div className="backdrop-blur-xl bg-gray-900/40 border border-gray-800/50 rounded-2xl p-6 hover:border-indigo-500/30 transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  <Disc3 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">Vocal Track</h3>
                  <p className="text-sm text-gray-500">Upload your vocal recording</p>
                </div>
              </div>
              
              <div className="border-2 border-dashed border-gray-700 rounded-xl p-12 text-center hover:border-indigo-500/50 transition-all duration-300 cursor-pointer group">
                <Upload className="w-12 h-12 text-gray-600 mx-auto mb-4 group-hover:text-indigo-400 transition-colors" />
                <p className="text-gray-400 mb-2">Drop your vocal file here or click to browse</p>
                <p className="text-sm text-gray-600">Supports: WAV, MP3, M4A (Max 50MB)</p>
              </div>
            </div>

            {/* Beat Upload */}
            <div className="backdrop-blur-xl bg-gray-900/40 border border-gray-800/50 rounded-2xl p-6 hover:border-purple-500/30 transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">Instrumental/Beat</h3>
                  <p className="text-sm text-gray-500">Optional - for preview in context</p>
                </div>
              </div>
              
              <div className="border-2 border-dashed border-gray-700 rounded-xl p-12 text-center hover:border-purple-500/50 transition-all duration-300 cursor-pointer group">
                <Upload className="w-12 h-12 text-gray-600 mx-auto mb-4 group-hover:text-purple-400 transition-colors" />
                <p className="text-gray-400 mb-2">Drop your beat here (optional)</p>
                <p className="text-sm text-gray-600">Hear your processed vocal with the beat</p>
              </div>
            </div>

            {/* Waveform Visualization Placeholder */}
            <div className="backdrop-blur-xl bg-gray-900/40 border border-gray-800/50 rounded-2xl p-6">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <Sliders className="w-5 h-5" />
                Waveform & Preview
              </h3>
              <div className="h-32 bg-gradient-to-r from-indigo-950/50 to-purple-950/50 rounded-xl flex items-center justify-center border border-gray-800/30">
                <p className="text-gray-600">Upload audio to see waveform</p>
              </div>
              
              {/* Playback Controls */}
              <div className="flex items-center justify-center gap-4 mt-6">
                <button className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center hover:from-indigo-500 hover:to-purple-500 transition-all duration-200">
                  <Play className="w-5 h-5 text-white ml-1" />
                </button>
                <div className="flex-1 h-2 bg-gray-800 rounded-full">
                  <div className="h-full w-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
                </div>
                <span className="text-sm text-gray-500">0:00 / 0:00</span>
              </div>
            </div>
          </div>

          {/* Presets & Controls Sidebar */}
          <div className="space-y-6">
            
            {/* Preset Selection */}
            <div className="backdrop-blur-xl bg-gray-900/40 border border-gray-800/50 rounded-2xl p-6">
              <h3 className="text-white font-semibold mb-4">Choose Your Style</h3>
              <div className="space-y-3">
                {presets.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => setSelectedPreset(preset.id)}
                    className={`w-full p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                      selectedPreset === preset.id
                        ? 'border-indigo-500 bg-indigo-500/10'
                        : 'border-gray-700 bg-gray-800/30 hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{preset.emoji}</span>
                      <div className="flex-1">
                        <p className="text-white font-medium">{preset.name}</p>
                        <div className="flex gap-1 mt-1">
                          {[...Array(5)].map((_, i) => (
                            <div key={i} className={`h-1 w-6 rounded-full bg-gradient-to-r ${preset.color}`}></div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Controls Placeholder */}
            <div className="backdrop-blur-xl bg-gray-900/40 border border-gray-800/50 rounded-2xl p-6">
              <h3 className="text-white font-semibold mb-4">Quick Tweaks</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Compression</label>
                  <input type="range" className="w-full" min="0" max="100" defaultValue="70" />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Brightness</label>
                  <input type="range" className="w-full" min="0" max="100" defaultValue="50" />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Presence</label>
                  <input type="range" className="w-full" min="0" max="100" defaultValue="60" />
                </div>
              </div>
            </div>

            {/* Process Button */}
            <button className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-lg transition-all duration-300 shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5" />
              Process Audio
            </button>

            {/* Download Button (disabled state) */}
            <button className="w-full py-4 rounded-xl bg-gray-800/50 text-gray-500 font-semibold flex items-center justify-center gap-2 cursor-not-allowed">
              <Download className="w-5 h-5" />
              Download (Process first)
            </button>
          </div>
        </div>

        {/* Stats Footer */}
        <div className="grid grid-cols-3 gap-6">
          <div className="backdrop-blur-xl bg-gray-900/40 border border-gray-800/50 rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-indigo-400">0</p>
            <p className="text-sm text-gray-500">Tracks Processed</p>
          </div>
          <div className="backdrop-blur-xl bg-gray-900/40 border border-gray-800/50 rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-purple-400">0s</p>
            <p className="text-sm text-gray-500">Processing Time</p>
          </div>
          <div className="backdrop-blur-xl bg-gray-900/40 border border-gray-800/50 rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-pink-400">Pro</p>
            <p className="text-sm text-gray-500">Quality Level</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
