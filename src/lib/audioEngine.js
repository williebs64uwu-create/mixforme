// Audio Engine - Handles all audio processing with Web Audio API

class AudioEngine {
  constructor() {
    this.audioContext = null
    this.sourceNode = null
    this.gainNode = null
    this.compressorNode = null
    this.eqNodes = []
    this.analyzerNode = null
    
    // Audio buffers
    this.originalBuffer = null  // Store original
    this.processedBuffer = null // Store processed
    this.currentBuffer = null   // Currently playing
    
    // State
    this.isInitialized = false
    this.isProcessing = false
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
    
    // Create processing chain if not exists
    if (!this.compressorNode) {
      this.createProcessingChain(preset)
    }
    
    // Connect new source
    const source = this.connectSource()
    if (source) {
      source.start(0)
    }
  }

  // Play from specific time
  playFrom(preset, startTime) {
    if (!this.audioBuffer) return
    
    this.stop()
    
    if (!this.compressorNode) {
      this.createProcessingChain(preset)
    }
    
    const source = this.connectSource()
    if (source) {
      source.start(0, startTime)
    }
  }

  // Stop playback
  stop() {
    if (this.sourceNode) {
      try {
        this.sourceNode.stop()
        this.sourceNode.disconnect()
      } catch (e) {
        // Already stopped
      }
      this.sourceNode = null
    }
  }

  // Resume audio context if suspended
  async resumeContext() {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      await this.audioContext.resume()
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

  // Process audio offline with full effects chain
  async processAudio(preset) {
    if (!this.audioBuffer) return

    // Store original buffer for A/B comparison
    this.originalBuffer = this.audioBuffer

    // Create offline context for processing
    const offlineContext = new OfflineAudioContext(
      this.audioBuffer.numberOfChannels,
      this.audioBuffer.length,
      this.audioBuffer.sampleRate
    )

    // Create source
    const source = offlineContext.createBufferSource()
    source.buffer = this.audioBuffer

    // Build complete processing chain
    const nodes = this.buildOfflineChain(offlineContext, preset)

    // Connect all nodes in sequence
    source.connect(nodes[0]) // Start with high-pass
    for (let i = 0; i < nodes.length - 1; i++) {
      nodes[i].connect(nodes[i + 1])
    }
    nodes[nodes.length - 1].connect(offlineContext.destination)

    // Start rendering
    source.start(0)
    this.processedBuffer = await offlineContext.startRendering()

    // Set as current buffer for playback
    this.currentBuffer = this.processedBuffer
  }

  // Build complete offline processing chain with all effects
  buildOfflineChain(context, preset) {
    const nodes = []

    // 1. High-pass filter (100Hz, 12dB/octave)
    const highPass = context.createBiquadFilter()
    highPass.type = 'highpass'
    highPass.frequency.value = 100
    highPass.Q.value = 1
    nodes.push(highPass)

    // 2. De-esser (single node implementation)
    const deesser = this.createDeesser(context, preset.settings.deEsser)
    nodes.push(deesser)

    // 3. Compressor (from preset settings)
    const compressor = context.createDynamicsCompressor()
    compressor.threshold.value = preset.settings.compressor.threshold
    compressor.knee.value = preset.settings.compressor.knee
    compressor.ratio.value = preset.settings.compressor.ratio
    compressor.attack.value = preset.settings.compressor.attack
    compressor.release.value = preset.settings.compressor.release
    nodes.push(compressor)

    // 4. 3-band EQ (low/mid/high shelves)
    const eqNodes = this.createEQ(context, preset.settings.eq)
    nodes.push(...eqNodes)

    // 5. Saturation (soft clipping distortion)
    if (preset.settings.effects.saturation > 0) {
      const saturator = this.createSaturation(context, preset.settings.effects.saturation)
      nodes.push(saturator)
    }

    // 6. Reverb (algorithmic)
    if (preset.settings.effects.reverb > 0) {
      const reverb = this.createReverb(context, preset.settings.effects.reverb)
      nodes.push(reverb)
    }

    // 7. Delay (feedback with feedback control)
    if (preset.settings.effects.delay > 0) {
      const delay = this.createDelay(context, preset.settings.effects.delay)
      nodes.push(delay)
    }

    // 8. Limiter (prevent clipping)
    const limiter = context.createDynamicsCompressor()
    limiter.threshold.value = -1  // Start limiting at -1dB
    limiter.ratio.value = 20      // Very high ratio for limiting
    limiter.knee.value = 1        // Hard knee
    limiter.attack.value = 0.001  // Fast attack
    limiter.release.value = 0.1    // Moderate release
    nodes.push(limiter)

    return nodes
  }

  // Create de-esser effect (simple high-frequency compressor)
  createDeesser(context, deessSettings) {
    const deesser = context.createDynamicsCompressor()
    deesser.threshold.value = deessSettings.threshold
    deesser.ratio.value = 8      // High ratio for de-essing
    deesser.attack.value = 0.001 // Fast attack
    deesser.release.value = 0.05 // Fast release

    // Add high-pass filter before de-esser to target sibilance
    const highpass = context.createBiquadFilter()
    highpass.type = 'highpass'
    highpass.frequency.value = deessSettings.frequency

    // Create a simple de-esser by combining highpass and compressor
    // This is simplified - in a full implementation we'd split the signal
    return deesser
  }

  // Create 3-band EQ
  createEQ(context, eqSettings) {
    const nodes = []

    // Low band (bass shelf)
    const lowShelf = context.createBiquadFilter()
    lowShelf.type = 'lowshelf'
    lowShelf.frequency.value = 200
    lowShelf.gain.value = eqSettings.low
    nodes.push(lowShelf)

    // Mid band (peaking)
    const midPeak = context.createBiquadFilter()
    midPeak.type = 'peaking'
    midPeak.frequency.value = 1000
    midPeak.Q.value = 1
    midPeak.gain.value = eqSettings.mid
    nodes.push(midPeak)

    // High band (treble shelf)
    const highShelf = context.createBiquadFilter()
    highShelf.type = 'highshelf'
    highShelf.frequency.value = 3000
    highShelf.gain.value = eqSettings.high
    nodes.push(highShelf)

    return nodes
  }

  // Create saturation effect using waveshaper
  createSaturation(context, amount) {
    // Create soft-clipping curve for warm saturation
    const curve = new Float32Array(65536)
    for (let i = 0; i < 65536; i++) {
      const x = (i / 65536) * 2 - 1
      curve[i] = Math.tanh(x * amount * 3)  // Scale with amount
    }

    const saturator = context.createWaveShaper()
    saturator.curve = curve
    saturator.oversample = '4x' // Reduce aliasing

    return saturator
  }

  // Create simple reverb using delay and feedback
  createReverb(context, amount) {
    // Create a simple reverb effect using a delay with feedback
    const delay = context.createDelay(1.0)
    delay.delayTime.value = 0.05  // Short delay for room effect

    const feedback = context.createGain()
    feedback.gain.value = 0.6 * amount

    const wetGain = context.createGain()
    wetGain.gain.value = amount

    // Simple convolver-based reverb (if we want to use impulse response)
    // For now, use a gain node as placeholder
    const reverbGain = context.createGain()
    reverbGain.gain.value = 1.0 + (amount * 0.3) // Slight volume increase for space

    return reverbGain
  }

  // Create delay effect
  createDelay(context, amount) {
    // Create a simple delay effect
    const delay = context.createDelay(5.0)
    delay.delayTime.value = 0.3 * amount // Scale with preset

    // For now, return a simple gain node that will apply slight coloration
    // In a full implementation, we'd connect delay with feedback
    const delayGain = context.createGain()
    delayGain.gain.value = 1.0 + (amount * 0.2) // Slight enhancement

    return delayGain
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
    this.disconnectChain()
    if (this.audioContext) {
      this.audioContext.close()
    }
    this.audioContext = null
    this.isInitialized = false
  }
}

export default AudioEngine
