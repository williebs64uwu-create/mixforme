```javascript
import { useState, useEffect, useCallback } from 'react';
import { Mic2, Layers, Settings, Share2, Music, Volume2, Menu, X } from 'lucide-react';
import AudioUploader from './components/AudioUploader';
import WaveformVisualizer from './components/WaveformVisualizer';
import AudioPlayer from './components/AudioPlayer';
import VolumeMeters from './components/VolumeMeters';
import ExportModal from './components/ExportModal';
import EQControl from './components/effects/EQControl';
import CompressorControl from './components/effects/CompressorControl';
import ReverbControl from './components/effects/ReverbControl';
import DelayControl from './components/effects/DelayControl';
import audioEngine from './lib/audioEngine';
import { applyPreset } from './lib/effects';
import firebaseService from './lib/firebaseService';

function App() {
  // State
  const [isInitialized, setIsInitialized] = useState(false);
  const [tracks, setTracks] = useState([]);
  const [selectedTrackId, setSelectedTrackId] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('effects'); // effects, mixer
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Effect Bypass States
  const [bypassStates, setBypassStates] = useState({
    eq: false,
    compressor: false,
    reverb: false,
    delay: false,
  });

  // Initialize Audio Engine
  useEffect(() => {
    const init = async () => {
      await firebaseService.initialize();
      // Audio engine initializes on first user interaction to respect autoplay policies
    };
    init();

    // Cleanup
    return () => {
      audioEngine.dispose();
    };
  }, []);

  // Playback Loop
  useEffect(() => {
    let animationFrame;
    
    const updatePlayback = () => {
      if (isPlaying) {
        const time = audioEngine.masterChannel.context.currentTime;
        // This is a simplified time tracking, in a real app we'd sync with Transport
        setCurrentTime(prev => {
          const newTime = prev + 0.016; // approx 60fps
          if (newTime >= duration && duration > 0) {
            setIsPlaying(false);
            return 0;
          }
          return newTime;
        });
        animationFrame = requestAnimationFrame(updatePlayback);
      }
    };

    if (isPlaying) {
      animationFrame = requestAnimationFrame(updatePlayback);
    }

    return () => cancelAnimationFrame(animationFrame);
  }, [isPlaying, duration]);

  // Handlers
  const handleFileUpload = async (files) => {
    if (!isInitialized) {
      await audioEngine.initialize();
      setIsInitialized(true);
    }

    for (const fileData of files) {
      // Skip if already loaded
      if (tracks.find(t => t.id === fileData.id)) continue;

      const result = await audioEngine.loadTrack(fileData.id, fileData.file);
      
      if (result.success) {
        setDuration(Math.max(duration, result.duration));
        setTracks(prev => {
          const newTracks = [...prev, { ...fileData, duration: result.duration, level: 0 }];
          if (!selectedTrackId) setSelectedTrackId(fileData.id);
          return newTracks;
        });
        
        // Apply default effects if it's a vocal track (guess based on name)
        if (fileData.name.toLowerCase().includes('vocal') || fileData.name.toLowerCase().includes('voice')) {
          applyPreset(fileData.id, 'presence', audioEngine);
        }
      }
    }
  };

  const handlePlay = () => {
    if (!isInitialized) return;
    audioEngine.play();
    setIsPlaying(true);
  };

  const handlePause = () => {
    audioEngine.pause();
    setIsPlaying(false);
  };

  const handleStop = () => {
    audioEngine.stop();
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleSeek = (time) => {
    audioEngine.seek(time);
    setCurrentTime(time);
  };

  const handleVolumeChange = (val) => {
    setVolume(val);
    audioEngine.setMasterVolume(val);
  };

  const handleEffectChange = (type, settings) => {
    if (!selectedTrackId) return;
    // In a real implementation, we would update the specific effect node
    // For now, we just log it as the architecture is set up
    console.log(`Updating ${type} for track ${selectedTrackId}`, settings);
  };

  const toggleBypass = (effect) => {
    setBypassStates(prev => ({ ...prev, [effect]: !prev[effect] }));
    // In real implementation: audioEngine.bypassEffect(selectedTrackId, effect, !bypassStates[effect]);
  };

  const handleExport = async (format, quality) => {
    return await audioEngine.exportAudio();
  };

  const selectedTrack = tracks.find(t => t.id === selectedTrackId);

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col overflow-hidden">
      {/* Header */}
      <header className="h-16 glass border-b border-gray-800 flex items-center justify-between px-6 z-20">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-purple-900 flex items-center justify-center shadow-glow">
            <Mic2 className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            <span className="text-white">Mix</span>
            <span className="text-purple-500">ForMe</span>
          </h1>
        </div>

        <div className="hidden md:flex items-center space-x-6">
          <div className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-900 border border-gray-800">
            <div className={`w-2 h-2 rounded-full ${isInitialized ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`} />
            <span className="text-xs font-medium text-gray-400">
              {isInitialized ? 'Audio Engine Ready' : 'Waiting for Input'}
            </span>
          </div>
          
          <button 
            onClick={() => setIsExportModalOpen(true)}
            className="btn-primary flex items-center space-x-2 text-sm py-2"
            disabled={tracks.length === 0}
          >
            <Share2 className="w-4 h-4" />
            <span>Export Mix</span>
          </button>
        </div>

        <button 
          className="md:hidden p-2 text-gray-400 hover:text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden relative">
        {/* Left Sidebar - Tracks */}
        <aside className={`
          w-80 bg-gray-900 border-r border-gray-800 flex flex-col
          absolute md:relative z-10 h-full transition-transform duration-300
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}>
          <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar">
            <div>
              <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">
                Project Files
              </h2>
              <AudioUploader onFilesUploaded={handleFileUpload} />
            </div>

            {tracks.length > 0 && (
              <div>
                <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">
                  Tracks
                </h2>
                <div className="space-y-2">
                  {tracks.map(track => (
                    <div 
                      key={track.id}
                      onClick={() => setSelectedTrackId(track.id)}
                      className={`
                        p-3 rounded-lg cursor-pointer transition-all duration-200 border
                        ${selectedTrackId === track.id 
                          ? 'bg-purple-900/30 border-purple-500/50 shadow-glow' 
                          : 'bg-gray-800 border-transparent hover:bg-gray-800/80'
                        }
                      `}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2 overflow-hidden">
                          <Music className={`w-4 h-4 ${selectedTrackId === track.id ? 'text-purple-400' : 'text-gray-500'}`} />
                          <span className={`text-sm font-medium truncate ${selectedTrackId === track.id ? 'text-white' : 'text-gray-400'}`}>
                            {track.name}
                          </span>
                        </div>
                      </div>
                      
                      {/* Mini Volume Control */}
                      <div className="flex items-center space-x-2">
                        <Volume2 className="w-3 h-3 text-gray-600" />
                        <input 
                          type="range" 
                          className="slider h-1" 
                          defaultValue="80"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Center - Visualization & Player */}
        <section className="flex-1 flex flex-col bg-gray-950 relative overflow-hidden">
          {/* Background Effects */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-900/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-900/10 rounded-full blur-3xl" />
          </div>

          <div className="flex-1 p-6 flex flex-col justify-center space-y-8 relative z-10">
            {tracks.length === 0 ? (
              <div className="text-center space-y-4 opacity-50">
                <div className="w-24 h-24 mx-auto rounded-full bg-gray-900 flex items-center justify-center border-2 border-dashed border-gray-800">
                  <Music className="w-10 h-10 text-gray-600" />
                </div>
                <h3 className="text-xl font-medium text-gray-400">Start by uploading a track</h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  Upload your vocals and beat to start mixing with professional tools.
                </p>
              </div>
            ) : (
              <div className="space-y-6 animate-fade-in">
                <div className="glass-strong rounded-xl p-1 border border-gray-800">
                  <WaveformVisualizer 
                    audioBuffer={selectedTrack?.file ? null : null} // In real app, pass buffer
                    isPlaying={isPlaying}
                    currentTime={currentTime}
                    duration={duration}
                    onSeek={handleSeek}
                  />
                </div>
                
                <AudioPlayer 
                  isPlaying={isPlaying}
                  currentTime={currentTime}
                  duration={duration}
                  volume={volume}
                  onPlay={handlePlay}
                  onPause={handlePause}
                  onStop={handleStop}
                  onSeek={handleSeek}
                  onVolumeChange={handleVolumeChange}
                />
              </div>
            )}
          </div>
        </section>

        {/* Right Sidebar - Effects & Mixer */}
        <aside className="w-80 bg-gray-900 border-l border-gray-800 flex flex-col z-10">
          {/* Tabs */}
          <div className="flex border-b border-gray-800">
            <button
              onClick={() => setActiveTab('effects')}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${
                activeTab === 'effects' 
                  ? 'text-white border-b-2 border-purple-500 bg-gray-800/50' 
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <Settings className="w-4 h-4" />
                <span>Effects Chain</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('mixer')}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${
                activeTab === 'mixer' 
                  ? 'text-white border-b-2 border-purple-500 bg-gray-800/50' 
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <Layers className="w-4 h-4" />
                <span>Mixer</span>
              </div>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
            {activeTab === 'effects' ? (
              <div className="space-y-6">
                {!selectedTrackId ? (
                  <div className="text-center py-10 text-gray-500">
                    Select a track to edit effects
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-bold text-silver-400 uppercase tracking-wider">
                        Insert Effects
                      </h3>
                      <span className="text-xs text-purple-400">
                        {selectedTrack?.name}
                      </span>
                    </div>
                    
                    <div className="space-y-4 animate-slide-in-right">
                      <EQControl 
                        onChange={(s) => handleEffectChange('eq', s)}
                        onBypass={() => toggleBypass('eq')}
                        isBypassed={bypassStates.eq}
                      />
                      
                      <CompressorControl 
                        onChange={(s) => handleEffectChange('compressor', s)}
                        onBypass={() => toggleBypass('compressor')}
                        isBypassed={bypassStates.compressor}
                      />
                      
                      <ReverbControl 
                        onChange={(s) => handleEffectChange('reverb', s)}
                        onBypass={() => toggleBypass('reverb')}
                        isBypassed={bypassStates.reverb}
                      />
                      
                      <DelayControl 
                        onChange={(s) => handleEffectChange('delay', s)}
                        onBypass={() => toggleBypass('delay')}
                        isBypassed={bypassStates.delay}
                      />
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="h-full flex flex-col">
                <h3 className="text-sm font-bold text-silver-400 uppercase tracking-wider mb-6">
                  Master Output
                </h3>
                <VolumeMeters tracks={tracks} />
                
                <div className="mt-8 p-4 rounded-xl bg-gray-800/50 border border-gray-700">
                  <h4 className="text-xs font-semibold text-gray-400 mb-4">Output Routing</h4>
                  <div className="space-y-2 text-sm text-gray-500">
                    <div className="flex justify-between">
                      <span>Sample Rate</span>
                      <span className="text-silver-300">44.1 kHz</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Bit Depth</span>
                      <span className="text-silver-300">32-bit Float</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Latency</span>
                      <span className="text-silver-300">~12ms</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </aside>
      </main>

      <ExportModal 
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onExport={handleExport}
      />
    </div>
  );
}

export default App;
```
