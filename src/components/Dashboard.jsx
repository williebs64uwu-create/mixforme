import { useState, useEffect, useRef } from 'react'
import Navbar from './Navbar'
import AudioUploader from './AudioUploader'
import AudioPlayer from './AudioPlayer'
import Waveform from './Waveform'
import ControlPanel from './ControlPanel'
import SpectrumAnalyzer from './SpectrumAnalyzer'
import VUMeter from './VUMeter'
import ProcessingChain from './ProcessingChain'
import ABComparison from './ABComparison'
import { Disc3, Sparkles, Download, Check } from 'lucide-react'
import { getPreset, getPresetList } from '../lib/presets'
import AudioEngine from '../lib/audioEngine'

function Dashboard() {
  const [vocalFile, setVocalFile] = useState(null)
  const [beatFile, setBeatFile] = useState(null)
  const [selectedPreset, setSelectedPreset] = useState('rap')
  const [isProcessing, setIsProcessing] = useState(false)
  const [isProcessed, setIsProcessed] = useState(false)
  const [audioBuffer, setAudioBuffer] = useState(null)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [abMode, setABMode] = useState('A')
  
  const audioEngineRef = useRef(null)
  const presets = getPresetList()

  // Initialize audio engine
  useEffect(() => {
    audioEngineRef.current = new AudioEngine()
    return () => {
      if (audioEngineRef.current) {
        audioEngineRef.current.dispose()
      }
    }
  }, [])

  // Load vocal file into audio engine
  useEffect(() => {
    if (vocalFile && audioEngineRef.current) {
      loadAudio()
    }
  }, [vocalFile])

  const loadAudio = async () => {
    try {
      setIsProcessing(true)
      const buffer = await audioEngineRef.current.loadAudioFile(vocalFile)
      setAudioBuffer(buffer)
      setDuration(buffer.duration)
      setIsProcessing(false)
    } catch (error) {
      console.error('Error loading audio:', error)
      alert('Error loading audio file. Please try a different file.')
      setIsProcessing(false)
    }
  }

  const handleVocalUpload = (file) => {
    setVocalFile(file)
    setIsProcessed(false)
  }

  const handleBeatUpload = (file) => {
    setBeatFile(file)
  }

  const handleRemoveVocal = () => {
    setVocalFile(null)
    setAudioBuffer(null)
    setIsProcessed(false)
    if (audioEngineRef.current) {
      audioEngineRef.current.stop()
    }
  }

  const handleRemoveBeat = () => {
    setBeatFile(null)
  }

  const handlePresetChange = (presetId) => {
    setSelectedPreset(presetId)
    setIsProcessed(false)
  }

  const handleProcess = () => {
    if (!vocalFile || !audioEngineRef.current) return
    
    setIsProcessing(true)
    const preset = getPreset(selectedPreset)
    
    // Simulate processing time
    setTimeout(() => {
      setIsProcessing(false)
      setIsProcessed(true)
      alert(`Processing complete with ${preset.name} preset! 🎉`)
    }, 2000)
  }

  const handleEQChange = (band, value) => {
    if (audioEngineRef.current) {
      audioEngineRef.current.updateEQ(band, value)
    }
  }

  const handleCompressionChange = (value) => {
    if (audioEngineRef.current) {
      audioEngineRef.current.updateCompression(value)
    }
  }

  const handleReset = () => {
    setSelectedPreset('rap')
    setIsProcessed(false)
  }

  const handleDownload = async () => {
    if (!audioEngineRef.current || !isProcessed) return
    
    try {
      const blob = await audioEngineRef.current.exportAudio()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${vocalFile.name.replace(/\.[^/.]+$/, '')}_processed.wav`
      a.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error exporting audio:', error)
      alert('Error exporting audio. Please try again.')
    }
  }

  const handleABToggle = (mode) => {
    setABMode(mode)
    // TODO: Switch between original and processed audio
    console.log('Switched to mode:', mode)
  }

  const currentPreset = getPreset(selectedPreset)

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
          
          {/* Upload & Visualization Section */}
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

            {/* Waveform Visualization */}
            <div className="backdrop-blur-xl bg-gray-900/40 border border-gray-800/50 rounded-2xl p-6">
              <h3 className="text-white font-semibold mb-4">Waveform</h3>
              <Waveform 
                audioBuffer={audioBuffer}
                isPlaying={isPlaying}
                currentTime={currentTime}
                duration={duration}
              />
            </div>

            {/* Audio Player */}
            <AudioPlayer 
              vocalFile={vocalFile}
              beatFile={beatFile}
            />

            {/* Spectrum Analyzer */}
            <SpectrumAnalyzer
              audioEngine={audioEngineRef.current}
              isPlaying={isPlaying}
            />

            {/* VU Meters */}
            <VUMeter
              audioEngine={audioEngineRef.current}
              isPlaying={isPlaying}
              label="OUTPUT"
            />

            {/* Processing Chain Visualization */}
            <ProcessingChain
              isProcessing={isProcessing}
              preset={currentPreset}
            />

            {/* Control Panel */}
            <ControlPanel
              preset={currentPreset}
              onEQChange={handleEQChange}
              onCompressionChange={handleCompressionChange}
              onReset={handleReset}
              disabled={!vocalFile}
            />
          </div>

          {/* Presets & Actions Sidebar */}
          <div className="space-y-6">
            
            {/* Preset Selection */}
            <div className="backdrop-blur-xl bg-gray-900/40 border border-gray-800/50 rounded-2xl p-6">
              <h3 className="text-white font-semibold mb-4">Choose Your Style</h3>
              <div className="space-y-3">
                {presets.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => handlePresetChange(preset.id)}
                    disabled={isProcessing}
                    className={`w-full p-4 rounded-xl border-2 transition-all duration-300 text-left disabled:opacity-50 disabled:cursor-not-allowed ${
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
                      {selectedPreset === preset.id && (
                        <Check className="w-5 h-5 text-indigo-400" />
                      )}
                    </div>
                  </button>
                ))}
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
              {isProcessing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Processing...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Process Audio
                </>
              )}
            </button>

            {/* Download Button */}
            <button 
              onClick={handleDownload}
              disabled={!isProcessed}
              className={`w-full py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-300 ${
                isProcessed
                  ? 'bg-green-600 hover:bg-green-500 text-white shadow-lg shadow-green-500/30'
                  : 'bg-gray-800/50 text-gray-500 cursor-not-allowed'
              }`}
            >
              <Download className="w-5 h-5" />
              {isProcessed ? 'Download Processed Audio' : 'Download (Process first)'}
            </button>

            {/* A/B Comparison */}
            <ABComparison
              onToggle={handleABToggle}
              isProcessed={isProcessed}
              currentMode={abMode}
              disabled={!vocalFile}
            />

            {/* Status Info */}
            {isProcessed && (
              <div className="backdrop-blur-xl bg-green-900/20 border border-green-500/30 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                    <Check className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <p className="text-green-400 font-semibold">Ready to Download!</p>
                    <p className="text-sm text-gray-400">Your audio has been processed</p>
                  </div>
                </div>
              </div>
            )}
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
            <p className="text-3xl font-bold text-purple-400">
              {isProcessing ? 'Processing' : isProcessed ? 'Done' : 'Ready'}
            </p>
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
