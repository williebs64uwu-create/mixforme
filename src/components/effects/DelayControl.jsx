import { useState } from 'react';
import { Timer, Power } from 'lucide-react';

const DelayControl = ({ onChange, onBypass, isBypassed = false }) => {
    const [settings, setSettings] = useState({
        delayTime: 0.25,
        feedback: 0.3,
        wet: 0.3,
    });

    const handleChange = (param, value) => {
        const newSettings = { ...settings, [param]: value };
        setSettings(newSettings);
        onChange(newSettings);
    };

    const presets = [
        { name: 'Slap', values: { delayTime: 0.08, feedback: 0.1, wet: 0.2 } },
        { name: 'Short', values: { delayTime: 0.25, feedback: 0.3, wet: 0.3 } },
        { name: 'Medium', values: { delayTime: 0.5, feedback: 0.4, wet: 0.35 } },
        { name: 'Long', values: { delayTime: 1.0, feedback: 0.5, wet: 0.4 } },
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
                    <Timer className="w-5 h-5 text-purple-400" />
                    <h3 className="text-lg font-semibold text-silver-300">Delay</h3>
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
                {/* Delay Time */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-silver-400">Delay Time</label>
                        <span className="text-xs text-purple-400 font-mono">
                            {(settings.delayTime * 1000).toFixed(0)} ms
                        </span>
                    </div>
                    <input
                        type="range"
                        min="0.01"
                        max="2"
                        step="0.01"
                        value={settings.delayTime}
                        onChange={(e) => handleChange('delayTime', parseFloat(e.target.value))}
                        className="slider"
                        disabled={isBypassed}
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                        <span>10 ms</span>
                        <span>2000 ms</span>
                    </div>
                </div>

                {/* Feedback */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-silver-400">Feedback</label>
                        <span className="text-xs text-purple-400 font-mono">
                            {(settings.feedback * 100).toFixed(0)}%
                        </span>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="0.9"
                        step="0.01"
                        value={settings.feedback}
                        onChange={(e) => handleChange('feedback', parseFloat(e.target.value))}
                        className="slider"
                        disabled={isBypassed}
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                        <span>0%</span>
                        <span>90%</span>
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
            <div className="h-20 bg-gray-800 rounded-lg relative overflow-hidden flex items-center justify-center gap-4 px-4">
                {[...Array(Math.min(5, Math.ceil(settings.feedback * 5)))].map((_, i) => {
                    const size = 40 - (i * 6);
                    const opacity = 1 - (i * 0.2);
                    return (
                        <div
                            key={i}
                            className="rounded-full bg-purple-500 transition-all duration-300"
                            style={{
                                width: `${size}px`,
                                height: `${size}px`,
                                opacity: opacity * settings.wet,
                            }}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default DelayControl;
