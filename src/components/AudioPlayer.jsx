import { Play, Pause, Square, Volume2, RotateCcw } from 'lucide-react';
import { formatTime } from '../lib/waveformGenerator';

const AudioPlayer = ({
    isPlaying,
    currentTime,
    duration,
    volume,
    onPlay,
    onPause,
    onStop,
    onVolumeChange,
    onSeek
}) => {
    const handleProgressClick = (e) => {
        if (!onSeek || !duration) return;

        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const progress = x / rect.width;
        const seekTime = progress * duration;

        onSeek(seekTime);
    };

    const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

    return (
        <div className="glass-strong rounded-xl p-6 space-y-4">
            {/* Time Display */}
            <div className="flex items-center justify-between text-sm">
                <span className="text-silver-400 font-mono">
                    {formatTime(currentTime)}
                </span>
                <span className="text-gray-500 font-mono">
                    {formatTime(duration)}
                </span>
            </div>

            {/* Progress Bar */}
            <div
                className="relative h-2 bg-gray-700 rounded-full cursor-pointer group"
                onClick={handleProgressClick}
            >
                <div
                    className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-purple-600 to-purple-500 transition-all duration-100"
                    style={{ width: `${progress}%` }}
                />

                {/* Progress Handle */}
                <div
                    className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ left: `calc(${progress}% - 8px)` }}
                />
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    {/* Play/Pause Button */}
                    <button
                        onClick={isPlaying ? onPause : onPlay}
                        className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-purple-800 hover:from-purple-500 hover:to-purple-700 flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-glow"
                        disabled={!duration}
                    >
                        {isPlaying ? (
                            <Pause className="w-5 h-5 text-white" fill="white" />
                        ) : (
                            <Play className="w-5 h-5 text-white ml-0.5" fill="white" />
                        )}
                    </button>

                    {/* Stop Button */}
                    <button
                        onClick={onStop}
                        className="w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-all duration-300"
                        disabled={!duration}
                    >
                        <Square className="w-4 h-4 text-silver-400" fill="currentColor" />
                    </button>

                    {/* Reset Button */}
                    <button
                        onClick={() => onSeek(0)}
                        className="w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-all duration-300"
                        disabled={!duration}
                    >
                        <RotateCcw className="w-4 h-4 text-silver-400" />
                    </button>
                </div>

                {/* Volume Control */}
                <div className="flex items-center space-x-3">
                    <Volume2 className="w-5 h-5 text-gray-500" />
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={volume * 100}
                        onChange={(e) => onVolumeChange(e.target.value / 100)}
                        className="slider w-24"
                    />
                    <span className="text-xs text-gray-500 w-8 text-right">
                        {Math.round(volume * 100)}%
                    </span>
                </div>
            </div>
        </div>
    );
};

export default AudioPlayer;
