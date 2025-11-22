import { useEffect, useRef, useState } from 'react';
import { Activity } from 'lucide-react';

const VolumeMeter = ({ level = 0, label = 'Level', orientation = 'vertical' }) => {
    const [peakLevel, setPeakLevel] = useState(0);
    const [clipIndicator, setClipIndicator] = useState(false);

    useEffect(() => {
        if (level > peakLevel) {
            setPeakLevel(level);
            setTimeout(() => setPeakLevel(0), 1000);
        }

        if (level > 0.95) {
            setClipIndicator(true);
            setTimeout(() => setClipIndicator(false), 500);
        }
    }, [level]);

    const getColor = (value) => {
        if (value < 0.6) return 'meter-green';
        if (value < 0.85) return 'meter-yellow';
        return 'meter-red';
    };

    const levelPercent = Math.min(100, level * 100);
    const peakPercent = Math.min(100, peakLevel * 100);

    if (orientation === 'horizontal') {
        return (
            <div className="space-y-1">
                <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{label}</span>
                    {clipIndicator && (
                        <span className="text-xs text-red-500 font-bold animate-pulse">CLIP</span>
                    )}
                </div>
                <div className="h-6 bg-gray-800 rounded-lg overflow-hidden relative">
                    <div
                        className={`meter-bar ${getColor(level)}`}
                        style={{ width: `${levelPercent}%` }}
                    />
                    {peakLevel > 0 && (
                        <div
                            className="absolute top-0 w-0.5 h-full bg-white"
                            style={{ left: `${peakPercent}%` }}
                        />
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center space-y-2">
            <div className="w-8 h-48 bg-gray-800 rounded-lg overflow-hidden relative flex flex-col-reverse">
                <div
                    className={`meter-bar ${getColor(level)}`}
                    style={{ height: `${levelPercent}%` }}
                />
                {peakLevel > 0 && (
                    <div
                        className="absolute left-0 w-full h-0.5 bg-white"
                        style={{ bottom: `${peakPercent}%` }}
                    />
                )}

                {/* dB markers */}
                <div className="absolute inset-0 flex flex-col justify-between py-2 pointer-events-none">
                    <div className="w-full h-px bg-gray-700" />
                    <div className="w-full h-px bg-gray-700" />
                    <div className="w-full h-px bg-gray-700" />
                </div>
            </div>

            <div className="text-center">
                <span className="text-xs text-gray-500">{label}</span>
                {clipIndicator && (
                    <div className="text-xs text-red-500 font-bold animate-pulse">CLIP</div>
                )}
            </div>
        </div>
    );
};

const VolumeMeters = ({ tracks = [] }) => {
    return (
        <div className="card-glass space-y-4">
            <div className="flex items-center space-x-2">
                <Activity className="w-5 h-5 text-purple-400" />
                <h3 className="text-lg font-semibold text-silver-300">Levels</h3>
            </div>

            <div className="flex items-end justify-around gap-4">
                {tracks.map((track) => (
                    <VolumeMeter
                        key={track.id}
                        level={track.level || 0}
                        label={track.name}
                    />
                ))}

                {tracks.length === 0 && (
                    <div className="text-center py-8 text-gray-500 text-sm">
                        No tracks loaded
                    </div>
                )}
            </div>

            {/* dB Scale */}
            <div className="flex justify-between text-xs text-gray-500 px-2">
                <span>-∞</span>
                <span>-12</span>
                <span>-6</span>
                <span>0</span>
            </div>
        </div>
    );
};

export default VolumeMeters;
