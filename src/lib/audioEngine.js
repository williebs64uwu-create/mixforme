// Audio Engine - Handles all audio processing with Web Audio API

class AudioEngine {
  constructor() {
    this.audioContext = null
    this.sourceNode = null
    this.gainNode = null
    this.compressorNode = null
    this.eqNodes = []
    this.analyzerNode = null
    this.destinationNode = null
    
    // Audio buffers
    this.audioBuffer = null
    this.processedBuffer = null
    
    // State
    this.isInitialized = false
  }

  // Initialize Audio Context
  init() {
    if (this.isInitialized) return
    
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)()
    this.isInitialized = true
    
    console.log('Audio Engine initialized')
  }

  // Load audio file and decode
  async loadAudioFile(file) {
    if (!this.isInitialized) this.init()
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      
      reader.onload = async (e) => {
        try {
          this.audioBuffer = await this.audioContext.decodeAudioData(e.target.result)
          console.log('Audio loaded:', this.audioBuffer.duration, 'seconds')
          resolve(this.audioBuffer)
        } catch (error) {
          console.error('Error decoding audio:', error)
          reject(error)
        }
      }
      
      reader.onerror = reject
      reader.readAsArrayBuffer(file)
    })
  }

  // Create persistent audio processing chain (doesn't require source)
  createProcessingChain(preset) {
    if (!this.audioContext) return
    
    // Disconnect existing nodes
    this.disconnectChain()
    
    // Create gain (volume control)
    this.gainNode = this.audioContext.createGain()
    this.gainNode.gain.value = 1.0
    
    // Create compressor
    this.compressorNode = this.audioContext.createDynamicsCompressor()
    this.compressorNode.threshold.value = preset.settings.compressor.threshold
    this.compressorNode.knee.value = preset.settings.compressor.knee
    this.compressorNode.ratio.value = preset.settings.compressor.ratio
    this.compressorNode.attack.value = preset.settings.compressor.attack
    this.compressorNode.release.value = preset.settings.compressor.release
    
    // Create EQ (3-band)
    this.eqNodes = []
    
    // Low band (bass)
    const lowShelf = this.audioContext.createBiquadFilter()
    lowShelf.type = 'lowshelf'
    lowShelf.frequency.value = 200
    lowShelf.gain.value = preset.settings.eq.low
    this.eqNodes.push(lowShelf)
    
    // Mid band
    const midPeak = this.audioContext.createBiquadFilter()
    midPeak.type = 'peaking'
    midPeak.frequency.value = 1000
    midPeak.Q.value = 1
    midPeak.gain.value = preset.settings.eq.mid
    this.eqNodes.push(midPeak)
    
    // High band (treble)
    const highShelf = this.audioContext.createBiquadFilter()
    highShelf.type = 'highshelf'
    highShelf.frequency.value = 3000
    highShelf.gain.value = preset.settings.eq.high
    this.eqNodes.push(highShelf)
    
    // Create analyzer for visualization
    this.analyzerNode = this.audioContext.createAnalyser()
    this.analyzerNode.fftSize = 2048
    this.analyzerNode.smoothingTimeConstant = 0.8
    
    // Connect the persistent chain (without source yet)
    this.compressorNode
      .connect(this.eqNodes[0])
      .connect(this.eqNodes[1])
      .connect(this.eqNodes[2])
      .connect(this.gainNode)
      .connect(this.analyzerNode)
      .connect(this.audioContext.destination)
    
    console.log('Processing chain created')
  }

  // Disconnect all nodes
  disconnectChain() {
    if (this.sourceNode) {
      try { this.sourceNode.disconnect() } catch (e) {}
    }
    if (this.compressorNode) {
      try { this.compressorNode.disconnect() } catch (e) {}
    }
    if (this.eqNodes.length > 0) {
      this.eqNodes.forEach(node => {
        try { node.disconnect() } catch (e) {}
      })
    }
    if (this.gainNode) {
      try { this.gainNode.disconnect() } catch (e) {}
    }
    if (this.analyzerNode) {
      try { this.analyzerNode.disconnect() } catch (e) {}
    }
  }

  // Connect source to processing chain
  connectSource() {
    if (!this.audioBuffer || !this.compressorNode) return null
    
    // Create new source
    this.sourceNode = this.audioContext.createBufferSource()
    this.sourceNode.buffer = this.audioBuffer
    
    // Connect to chain
    this.sourceNode.connect(this.compressorNode)
    
    return this.sourceNode
  }

  // Play audio with processing
  play(preset) {
    if (!this.audioBuffer) return
    
    this.stop() // Stop any current playback
    
    const source = this.createProcessingChain(preset)
    if (source) {
      source.start(0)
    }
  }

  // Stop playback
  stop() {
    if (this.sourceNode) {
      try {
        this.sourceNode.stop()
      } catch (e) {
        // Already stopped
      }
      this.sourceNode = null
    }
  }

  // Update EQ in real-time
  updateEQ(band, value) {
    if (this.eqNodes.length === 0) return
    
    const bandIndex = { low: 0, mid: 1, high: 2 }[band]
    if (bandIndex !== undefined && this.eqNodes[bandIndex]) {
      this.eqNodes[bandIndex].gain.value = value
    }
  }

  // Update compression in real-time
  updateCompression(value) {
    if (this.compressorNode) {
      // Map 0-100 to threshold range (-50 to 0)
      this.compressorNode.threshold.value = -50 + (value / 100) * 50
      // Adjust ratio based on threshold
      this.compressorNode.ratio.value = 2 + (value / 100) * 10
    }
  }

  // Update volume
  updateVolume(value) {
    if (this.gainNode) {
      this.gainNode.gain.value = value
    }
  }

  // Get waveform data for visualization
  getWaveformData() {
    if (!this.analyzerNode) return null
    
    const bufferLength = this.analyzerNode.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)
    this.analyzerNode.getByteTimeDomainData(dataArray)
    
    return dataArray
  }

  // Get frequency data for visualization
  getFrequencyData() {
    if (!this.analyzerNode) return null
    
    const bufferLength = this.analyzerNode.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)
    this.analyzerNode.getByteFrequencyData(dataArray)
    
    return dataArray
  }

  // Export processed audio
  async exportAudio() {
    if (!this.audioBuffer) return null
    
    // Create offline context for rendering
    const offlineContext = new OfflineAudioContext(
      this.audioBuffer.numberOfChannels,
      this.audioBuffer.length,
      this.audioBuffer.sampleRate
    )
    
    // Create processing chain in offline context
    const source = offlineContext.createBufferSource()
    source.buffer = this.audioBuffer
    
    // Apply same processing
    const compressor = offlineContext.createDynamicsCompressor()
    const gain = offlineContext.createGain()
    
    source.connect(compressor).connect(gain).connect(offlineContext.destination)
    
    source.start(0)
    
    // Render
    const renderedBuffer = await offlineContext.startRendering()
    
    // Convert to WAV
    return this.audioBufferToWav(renderedBuffer)
  }

  // Convert AudioBuffer to WAV file
  audioBufferToWav(buffer) {
    const length = buffer.length * buffer.numberOfChannels * 2
    const arrayBuffer = new ArrayBuffer(44 + length)
    const view = new DataView(arrayBuffer)
    
    // WAV header
    const writeString = (offset, string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i))
      }
    }
    
    writeString(0, 'RIFF')
    view.setUint32(4, 36 + length, true)
    writeString(8, 'WAVE')
    writeString(12, 'fmt ')
    view.setUint32(16, 16, true)
    view.setUint16(20, 1, true)
    view.setUint16(22, buffer.numberOfChannels, true)
    view.setUint32(24, buffer.sampleRate, true)
    view.setUint32(28, buffer.sampleRate * buffer.numberOfChannels * 2, true)
    view.setUint16(32, buffer.numberOfChannels * 2, true)
    view.setUint16(34, 16, true)
    writeString(36, 'data')
    view.setUint32(40, length, true)
    
    // Write audio data
    const channels = []
    for (let i = 0; i < buffer.numberOfChannels; i++) {
      channels.push(buffer.getChannelData(i))
    }
    
    let offset = 44
    for (let i = 0; i < buffer.length; i++) {
      for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
        const sample = Math.max(-1, Math.min(1, channels[channel][i]))
        view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true)
        offset += 2
      }
    }
    
    return new Blob([arrayBuffer], { type: 'audio/wav' })
  }

  // Clean up
  dispose() {
    this.stop()
    if (this.audioContext) {
      this.audioContext.close()
    }
    this.audioContext = null
    this.isInitialized = false
  }
}

export default AudioEngine
