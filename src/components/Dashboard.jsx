import { useState } from 'react'
import Navbar from './Navbar'
import AudioUploader from './AudioUploader'
import AudioPlayer from './AudioPlayer'
import { Disc3, Sparkles, Sliders, Download } from 'lucide-react'

function Dashboard() {
  const [vocalFile, setVocalFile] = useState(null)
  const [beatFile, setBeatFile] = useState(null)
  const [selectedPreset, setSelectedPreset] = useState('rap')
  const [isProcessing, setIsProcessing] = useState(false)

  const presets = [
    { id: 'rap', name: 'Rap/Trap', emoji: '🎤', color: 'from-red-500 to-orange-500' },
    { id: 'pop', name: 'Pop/Singing', emoji: '🎵', color: 'from-pink-500 to-purple-500' },
    { id: 'podcast', name: 'Podcast', emoji: '🎙️', color: 'from-blue-500 to-cyan-500' },
    { id: 'rnb', name: 'R&B/Soul', emoji: '🎹', color: 'from-purple-500 to-indigo-500' },
    { id: 'rock', name: 'Rock/Metal', emoji: '🎸', color: 'from-orange-500 to-red-600' },
  ]

  const handleVocalUpload = (file) => {
    setVocalFile(file)
  }

  const handleBeatUpload = (file) => {
    setBeatFile(file)
  }

  const handleRemoveVocal = () => {
    setVocalFile(null)
  }

  const handleRemoveBeat = () => {
    setBeatFile(null)
  }

  const handleProcess = () => {
    if (!vocalFile) return
    setIsProcessing(true)
    // TODO: Implement audio processing
    setTimeout(() => {
      setIsProcessing(false)
      alert('Processing complete! (This is a placeholder)')
    }, 2000)
  }

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
          
          {/* Upload & Player Section */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Vocal Upload */}
            <AudioUploader
              title="Vocal Track"
              subtitle="Upload your vocal recording"
              icon={Disc3}
              iconColor="from-indigo-500 to-purple-600"
              borderColor="border-gray-800/50"
              onFileUpload={handleVocalUpload}
              file={vocalFile}
              onRemove={handleRemoveVocal}
            />

            {/* Beat Upload */}
            <AudioUploader
              title="Instrumental/Beat"
              subtitle="Optional - for preview in context"
              icon={Sparkles}
              iconColor="from-purple-500 to-pink-600"
              borderColor="border-gray-800/50"
              onFileUpload={handleBeatUpload}
              file={beatFile}
              onRemove={handleRemoveBeat}
            />

            {/* Audio Player */}
            <AudioPlayer 
              vocalFile={vocalFile}
              beatFile={beatFile}
            />
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

            {/* Quick Controls */}
            <div className="backdrop-blur-xl bg-gray-900/40 border border-gray-800/50 rounded-2xl p-6">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <Sliders className="w-5 h-5" />
                Quick Tweaks
              </h3>
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
            <button 
              onClick={handleProcess}
              disabled={!vocalFile || isProcessing}
              className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                vocalFile && !isProcessing
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50'
                  : 'bg-gray-700 text-gray-500 cursor-not-allowed'
              }`}
            >
              <Sparkles className="w-5 h-5" />
              {isProcessing ? 'Processing...' : 'Process Audio'}
            </button>

            {/* Download Button */}
            <button 
              disabled={true}
              className="w-full py-4 rounded-xl bg-gray-800/50 text-gray-500 font-semibold flex items-center justify-center gap-2 cursor-not-allowed"
            >
              <Download className="w-5 h-5" />
              Download (Process first)
            </button>
          </div>
        </div>

        {/* Stats Footer */}
        <div className="grid grid-cols-3 gap-6">
          <div className="backdrop-blur-xl bg-gray-900/40 border border-gray-800/50 rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-indigo-400">
              {vocalFile ? '1' : '0'}
            </p>
            <p className="text-sm text-gray-500">Tracks Loaded</p>
          </div>
          <div className="backdrop-blur-xl bg-gray-900/40 border border-gray-800/50 rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-purple-400">Ready</p>
            <p className="text-sm text-gray-500">Status</p>
          </div>
          <div className="backdrop-blur-xl bg-gray-900/40 border border-gray-800/50 rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-pink-400">{selectedPreset.toUpperCase()}</p>
            <p className="text-sm text-gray-500">Selected Preset</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
