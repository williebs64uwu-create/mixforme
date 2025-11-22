import { useState } from 'react';
import { Gauge, Power } from 'lucide-react';

const CompressorControl = ({ onChange, onBypass, isBypassed = false }) => {
    const [settings, setSettings] = useState({
        threshold: -24,
        ratio: 4,
        attack: 0.003,
        release: 0.25,
        knee: 30,
    });

    const [gainReduction, setGainReduction] = useState(0);

    const handleChange = (param, value) => {
        const newSettings = { ...settings, [param]: value };
        setSettings(newSettings);
        onChange(newSettings);
    };

    const presets = [
        { name: 'Gentle', values: { threshold: -20, ratio: 2, attack: 0.01, release: 0.3 } },
        { name: 'Medium', values: { threshold: -18, ratio: 4, attack: 0.005, release: 0.2 } },
        { name: 'Heavy', values: { threshold: -12, ratio: 8, attack: 0.001, release: 0.1 } },
        { name: 'Limiter', values: { threshold: -6, ratio: 20, attack: 0.001, release: 0.05 } },
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
                    <Gauge className="w-5 h-5 text-purple-400" />
                    <h3 className="text-lg font-semibold text-silver-300">Compressor</h3>
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
                {/* Threshold */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-silver-400">Threshold</label>
                        <span className="text-xs text-purple-400 font-mono">
                            {settings.threshold.toFixed(1)} dB
                        </span>
                    </div>
                    <input
                        type="range"
                        min="-60"
                        max="0"
                        step="1"
                        value={settings.threshold}
                        onChange={(e) => handleChange('threshold', parseFloat(e.target.value))}
                        className="slider"
                        disabled={isBypassed}
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                        <span>-60 dB</span>
                        <span>0 dB</span>
                    </div>
                </div>

                {/* Ratio */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-silver-400">Ratio</label>
                        <span className="text-xs text-purple-400 font-mono">
                            {settings.ratio.toFixed(1)}:1
                        </span>
                    </div>
                    <input
                        type="range"
                        min="1"
                        max="20"
                        step="0.5"
                        value={settings.ratio}
                        onChange={(e) => handleChange('ratio', parseFloat(e.target.value))}
                        className="slider"
                        disabled={isBypassed}
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                        <span>1:1</span>
                        <span>20:1</span>
                    </div>
                </div>

                {/* Attack */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-silver-400">Attack</label>
                        <span className="text-xs text-purple-400 font-mono">
                            {(settings.attack * 1000).toFixed(1)} ms
                        </span>
                    </div>
                    <input
                        type="range"
                        min="0.001"
                        max="0.1"
                        step="0.001"
                        value={settings.attack}
                        onChange={(e) => handleChange('attack', parseFloat(e.target.value))}
                        className="slider"
                        disabled={isBypassed}
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                        <span>1 ms</span>
                        <span>100 ms</span>
                    </div>
                </div>

                {/* Release */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-silver-400">Release</label>
                        <span className="text-xs text-purple-400 font-mono">
                            {(settings.release * 1000).toFixed(0)} ms
                        </span>
                    </div>
                    <input
                        type="range"
                        min="0.01"
                        max="1"
                        step="0.01"
                        value={settings.release}
                        onChange={(e) => handleChange('release', parseFloat(e.target.value))}
                        className="slider"
                        disabled={isBypassed}
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                        <span>10 ms</span>
                        <span>1000 ms</span>
                    </div>
                </div>

                {/* Knee */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-silver-400">Knee</label>
                        <span className="text-xs text-purple-400 font-mono">
                            {settings.knee.toFixed(0)} dB
                        </span>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="40"
                        step="1"
                        value={settings.knee}
                        onChange={(e) => handleChange('knee', parseFloat(e.target.value))}
                        className="slider"
                        disabled={isBypassed}
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                        <span>Hard</span>
                        <span>Soft</span>
                    </div>
                </div>
            </div>

            {/* Gain Reduction Meter */}
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-silver-400">Gain Reduction</label>
                    <span className="text-xs text-gray-500 font-mono">
                        {gainReduction.toFixed(1)} dB
                    </span>
                </div>
                <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 transition-all duration-100"
                        style={{ width: `${Math.min(100, (Math.abs(gainReduction) / 20) * 100)}%` }}
                    />
                </div>
            </div>
        </div>
    );
};

export default CompressorControl;
