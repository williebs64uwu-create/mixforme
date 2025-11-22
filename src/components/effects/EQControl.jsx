import { useState } from 'react';
import { Sliders, Power } from 'lucide-react';

const EQControl = ({ onChange, onBypass, isBypassed = false }) => {
    const [settings, setSettings] = useState({
        low: 0,
        mid: 0,
        high: 0,
        lowFreq: 400,
        highFreq: 2500,
    });

    const handleChange = (param, value) => {
        const newSettings = { ...settings, [param]: value };
        setSettings(newSettings);
        onChange(newSettings);
    };

    const presets = [
        { name: 'Flat', values: { low: 0, mid: 0, high: 0 } },
        { name: 'Bright', values: { low: -1, mid: 0, high: 6 } },
        { name: 'Warm', values: { low: 2, mid: 1, high: -1 } },
        { name: 'Presence', values: { low: -2, mid: 3, high: 4 } },
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
                    <Sliders className="w-5 h-5 text-purple-400" />
                    <h3 className="text-lg font-semibold text-silver-300">Equalizer</h3>
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

            {/* EQ Bands */}
            <div className="space-y-4">
                {/* Low */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-silver-400">Low</label>
                        <span className="text-xs text-purple-400 font-mono">
                            {settings.low > 0 ? '+' : ''}{settings.low.toFixed(1)} dB
                        </span>
                    </div>
                    <input
                        type="range"
                        min="-12"
                        max="12"
                        step="0.5"
                        value={settings.low}
                        onChange={(e) => handleChange('low', parseFloat(e.target.value))}
                        className="slider"
                        disabled={isBypassed}
                    />
                    <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>-12 dB</span>
                        <input
                            type="number"
                            min="20"
                            max="800"
                            value={settings.lowFreq}
                            onChange={(e) => handleChange('lowFreq', parseInt(e.target.value))}
                            className="w-16 px-2 py-1 bg-gray-800 rounded text-center"
                            disabled={isBypassed}
                        />
                        <span>+12 dB</span>
                    </div>
                </div>

                {/* Mid */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-silver-400">Mid</label>
                        <span className="text-xs text-purple-400 font-mono">
                            {settings.mid > 0 ? '+' : ''}{settings.mid.toFixed(1)} dB
                        </span>
                    </div>
                    <input
                        type="range"
                        min="-12"
                        max="12"
                        step="0.5"
                        value={settings.mid}
                        onChange={(e) => handleChange('mid', parseFloat(e.target.value))}
                        className="slider"
                        disabled={isBypassed}
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                        <span>-12 dB</span>
                        <span>+12 dB</span>
                    </div>
                </div>

                {/* High */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-silver-400">High</label>
                        <span className="text-xs text-purple-400 font-mono">
                            {settings.high > 0 ? '+' : ''}{settings.high.toFixed(1)} dB
                        </span>
                    </div>
                    <input
                        type="range"
                        min="-12"
                        max="12"
                        step="0.5"
                        value={settings.high}
                        onChange={(e) => handleChange('high', parseFloat(e.target.value))}
                        className="slider"
                        disabled={isBypassed}
                    />
                    <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>-12 dB</span>
                        <input
                            type="number"
                            min="1000"
                            max="8000"
                            value={settings.highFreq}
                            onChange={(e) => handleChange('highFreq', parseInt(e.target.value))}
                            className="w-16 px-2 py-1 bg-gray-800 rounded text-center"
                            disabled={isBypassed}
                        />
                        <span>+12 dB</span>
                    </div>
                </div>
            </div>

            {/* Visual EQ Curve */}
            <div className="h-24 bg-gray-800 rounded-lg relative overflow-hidden">
                <svg className="w-full h-full" viewBox="0 0 300 100">
                    <defs>
                        <linearGradient id="eqGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
                        </linearGradient>
                    </defs>

                    {/* Grid */}
                    <line x1="0" y1="50" x2="300" y2="50" stroke="#2a2a3a" strokeWidth="1" strokeDasharray="5,5" />

                    {/* EQ Curve */}
                    <path
                        d={`M 0 ${50 - settings.low * 3} 
                Q 100 ${50 - settings.low * 3} 150 ${50 - settings.mid * 3}
                T 300 ${50 - settings.high * 3}`}
                        stroke="#8b5cf6"
                        strokeWidth="2"
                        fill="url(#eqGradient)"
                    />
                </svg>
            </div>
        </div>
    );
};

export default EQControl;
