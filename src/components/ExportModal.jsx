import { useState } from 'react';
import { Download, X, Loader } from 'lucide-react';
import { downloadBlob } from '../lib/waveformGenerator';

const ExportModal = ({ isOpen, onClose, onExport }) => {
    const [format, setFormat] = useState('wav');
    const [quality, setQuality] = useState('high');
    const [filename, setFilename] = useState('mixforme-export');
    const [isExporting, setIsExporting] = useState(false);

    if (!isOpen) return null;

    const handleExport = async () => {
        setIsExporting(true);

        try {
            const blob = await onExport(format, quality);
            const extension = format === 'wav' ? 'wav' : 'mp3';
            downloadBlob(blob, `${filename}.${extension}`);

            setTimeout(() => {
                setIsExporting(false);
                onClose();
            }, 1000);
        } catch (error) {
            console.error('Export failed:', error);
            alert('Export failed. Please try again.');
            setIsExporting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative glass-strong rounded-2xl p-8 max-w-md w-full mx-4 animate-slide-up">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-all duration-300"
                >
                    <X className="w-4 h-4" />
                </button>

                {/* Header */}
                <div className="flex items-center space-x-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center">
                        <Download className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-silver-300">Export Audio</h2>
                        <p className="text-sm text-gray-500">Download your mixed track</p>
                    </div>
                </div>

                {/* Form */}
                <div className="space-y-6">
                    {/* Filename */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-silver-400">Filename</label>
                        <input
                            type="text"
                            value={filename}
                            onChange={(e) => setFilename(e.target.value)}
                            className="input"
                            placeholder="Enter filename"
                        />
                    </div>

                    {/* Format */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-silver-400">Format</label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => setFormat('wav')}
                                className={`p-4 rounded-lg border-2 transition-all duration-300 ${format === 'wav'
                                        ? 'border-purple-600 bg-purple-600/20'
                                        : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                                    }`}
                            >
                                <div className="text-sm font-semibold text-silver-300">WAV</div>
                                <div className="text-xs text-gray-500 mt-1">Uncompressed</div>
                            </button>

                            <button
                                onClick={() => setFormat('mp3')}
                                className={`p-4 rounded-lg border-2 transition-all duration-300 ${format === 'mp3'
                                        ? 'border-purple-600 bg-purple-600/20'
                                        : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                                    }`}
                            >
                                <div className="text-sm font-semibold text-silver-300">MP3</div>
                                <div className="text-xs text-gray-500 mt-1">Compressed</div>
                            </button>
                        </div>
                    </div>

                    {/* Quality (for MP3) */}
                    {format === 'mp3' && (
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-silver-400">Quality</label>
                            <select
                                value={quality}
                                onChange={(e) => setQuality(e.target.value)}
                                className="input"
                            >
                                <option value="low">Low (128 kbps)</option>
                                <option value="medium">Medium (192 kbps)</option>
                                <option value="high">High (320 kbps)</option>
                            </select>
                        </div>
                    )}

                    {/* Info */}
                    <div className="p-4 rounded-lg bg-purple-600/10 border border-purple-600/30">
                        <p className="text-xs text-silver-400">
                            {format === 'wav'
                                ? 'WAV format provides the highest quality with no compression. File size will be larger.'
                                : `MP3 format compresses the audio. ${quality === 'high' ? 'High quality provides near-lossless compression.' : quality === 'medium' ? 'Medium quality balances size and quality.' : 'Low quality creates smaller files.'}`
                            }
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="btn-secondary flex-1"
                            disabled={isExporting}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleExport}
                            className="btn-primary flex-1 flex items-center justify-center gap-2"
                            disabled={isExporting || !filename}
                        >
                            {isExporting ? (
                                <>
                                    <Loader className="w-4 h-4 animate-spin" />
                                    Exporting...
                                </>
                            ) : (
                                <>
                                    <Download className="w-4 h-4" />
                                    Export
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExportModal;
