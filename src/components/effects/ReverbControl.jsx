import { useState } from 'react';
import { Waves, Power } from 'lucide-react';

const ReverbControl = ({ onChange, onBypass, isBypassed = false }) => {
    const [settings, setSettings] = useState({
        decay: 1.5,
        preDelay: 0.01,
        wet: 0.3,
    });

    const handleChange = (param, value) => {
        const newSettings = { ...settings, [param]: value };
        setSettings(newSettings);
        onChange(newSettings);
    };

    const presets = [
        { name: 'Small Room', values: { decay: 0.5, preDelay: 0.005, wet: 0.2 } },
        { name: 'Medium Hall', values: { decay: 1.5, preDelay: 0.01, wet: 0.3 } },
        { name: 'Large Hall', values: { decay: 3.0, preDelay: 0.02, wet: 0.4 } },
        { name: 'Cathedral', values: { decay: 5.0, preDelay: 0.03, wet: 0.5 } },
    ];

    const applyPreset = (preset) => {
        const newSettings = { ...settings, ...preset.values };
        setSettings(newSettings);
        onChange(newSettings);
    };

    return (
        <div className={`card-glass space-y-4 ${isBypassed ? 'opacity-50' : ''}`}>
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <Waves className="w-5 h-5 text-purple-400" />
                    <h3 className="text-lg font-semibold text-silver-300">Reverb</h3>
                </div>
                <button
                    onClick={onBypass}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${isBypassed ? 'bg-gray-700' : 'bg-purple-600 shadow-glow'
                        }`}
                    title={isBypassed ? 'Enable' : 'Bypass'}
                >
                    <Power className="w-4 h-4" />
                </button>
            </div>

            {/* Presets */}
            <div className="flex flex-wrap gap-2">
                {presets.map((preset) => (
                    <button
                        key={preset.name}
                        onClick={() => applyPreset(preset)}
                        className="btn-ghost px-3 py-1 text-xs"
                    >
                        {preset.name}
                    </button>
                ))}
            </div>

            {/* Controls */}
            <div className="space-y-4">
                {/* Decay Time */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-silver-400">Decay Time</label>
                        <span className="text-xs text-purple-400 font-mono">
                            {settings.decay.toFixed(2)} s
                        </span>
                    </div>
                    <input
                        type="range"
                        min="0.1"
                        max="10"
                        step="0.1"
                        value={settings.decay}
                        onChange={(e) => handleChange('decay', parseFloat(e.target.value))}
                        className="slider"
                        disabled={isBypassed}
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                        <span>0.1 s</span>
                        <span>10 s</span>
                    </div>
                </div>

                {/* Pre-Delay */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-silver-400">Pre-Delay</label>
                        <span className="text-xs text-purple-400 font-mono">
                            {(settings.preDelay * 1000).toFixed(1)} ms
                        </span>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="0.1"
                        step="0.001"
                        value={settings.preDelay}
                        onChange={(e) => handleChange('preDelay', parseFloat(e.target.value))}
                        className="slider"
                        disabled={isBypassed}
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                        <span>0 ms</span>
                        <span>100 ms</span>
                    </div>
                </div>

                {/* Wet/Dry Mix */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-silver-400">Wet/Dry Mix</label>
                        <span className="text-xs text-purple-400 font-mono">
                            {(settings.wet * 100).toFixed(0)}%
                        </span>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={settings.wet}
                        onChange={(e) => handleChange('wet', parseFloat(e.target.value))}
                        className="slider"
                        disabled={isBypassed}
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                        <span>Dry</span>
                        <span>Wet</span>
                    </div>
                </div>
            </div>

            {/* Visual Representation */}
            <div className="h-20 bg-gray-800 rounded-lg relative overflow-hidden">
                <svg className="w-full h-full" viewBox="0 0 300 80">
                    {/* Decay visualization */}
                    {[...Array(5)].map((_, i) => {
                        const opacity = 1 - (i * 0.15 * (1 / settings.decay));
                        const height = 60 - (i * 10);
                        const x = 50 + (i * 50);
                        return (
                            <rect
                                key={i}
                                x={x}
                                y={(80 - height) / 2}
                                width="30"
                                height={height}
                                fill="#8b5cf6"
                                opacity={Math.max(0.1, opacity * settings.wet)}
                                rx="4"
                            />
                        );
                    })}
                </svg>
            </div>
        </div>
    );
};

export default ReverbControl;
