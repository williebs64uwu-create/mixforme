import { useState, useCallback } from 'react';
import { Upload, File, X } from 'lucide-react';

const AudioUploader = ({ onFilesUploaded, maxFiles = 2 }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState([]);

    const handleDragEnter = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    const handleDragOver = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const files = Array.from(e.dataTransfer.files);
        processFiles(files);
    }, [uploadedFiles]);

    const handleFileInput = useCallback((e) => {
        const files = Array.from(e.target.files);
        processFiles(files);
    }, [uploadedFiles]);

    const processFiles = (files) => {
        const audioFiles = files.filter(file =>
            file.type.startsWith('audio/') ||
            file.name.match(/\.(mp3|wav|ogg|m4a|flac)$/i)
        );

        if (audioFiles.length === 0) {
            alert('Please upload audio files only');
            return;
        }

        if (uploadedFiles.length + audioFiles.length > maxFiles) {
            alert(`Maximum ${maxFiles} files allowed`);
            return;
        }

        const newFiles = audioFiles.map(file => ({
            id: Date.now() + Math.random(),
            file,
            name: file.name,
            size: file.size,
            type: file.type,
        }));

        const updated = [...uploadedFiles, ...newFiles];
        setUploadedFiles(updated);
        onFilesUploaded(updated);
    };

    const removeFile = (id) => {
        const updated = uploadedFiles.filter(f => f.id !== id);
        setUploadedFiles(updated);
        onFilesUploaded(updated);
    };

    const formatFileSize = (bytes) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    return (
        <div className="space-y-4">
            <div
                className={`
          relative border-2 border-dashed rounded-xl p-8 transition-all duration-300
          ${isDragging
                        ? 'border-purple-500 bg-purple-500/10 scale-105'
                        : 'border-gray-700 hover:border-purple-600 hover:bg-gray-800/50'
                    }
        `}
                onDragEnter={handleDragEnter}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <input
                    type="file"
                    multiple
                    accept="audio/*,.mp3,.wav,.ogg,.m4a,.flac"
                    onChange={handleFileInput}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    id="file-upload"
                />

                <div className="text-center pointer-events-none">
                    <Upload className={`
            w-12 h-12 mx-auto mb-4 transition-all duration-300
            ${isDragging ? 'text-purple-400 scale-110' : 'text-gray-500'}
          `} />

                    <h3 className="text-lg font-semibold text-silver-300 mb-2">
                        {isDragging ? 'Drop your files here' : 'Upload Audio Files'}
                    </h3>

                    <p className="text-sm text-gray-400 mb-2">
                        Drag and drop or click to browse
                    </p>

                    <p className="text-xs text-gray-500">
                        Supported: MP3, WAV, OGG, M4A, FLAC (Max {maxFiles} files)
                    </p>
                </div>
            </div>

            {uploadedFiles.length > 0 && (
                <div className="space-y-2 animate-slide-up">
                    <h4 className="text-sm font-semibold text-silver-400 mb-2">
                        Uploaded Files ({uploadedFiles.length}/{maxFiles})
                    </h4>

                    {uploadedFiles.map((fileData) => (
                        <div
                            key={fileData.id}
                            className="glass-light rounded-lg p-4 flex items-center justify-between group hover:border-purple-600 transition-all duration-300"
                        >
                            <div className="flex items-center space-x-3 flex-1">
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center">
                                    <File className="w-5 h-5 text-white" />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-silver-300 truncate">
                                        {fileData.name}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {formatFileSize(fileData.size)}
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={() => removeFile(fileData.id)}
                                className="ml-4 w-8 h-8 rounded-lg bg-gray-800 hover:bg-red-600 flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100"
                                title="Remove file"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AudioUploader;
