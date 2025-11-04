import { Upload, X, CheckCircle } from 'lucide-react'

function AudioUploader({ 
  title, 
  subtitle, 
  icon: Icon, 
  iconColor, 
  borderColor,
  onFileUpload,
  file,
  onRemove
}) {
  
  const handleDrop = (e) => {
    e.preventDefault()
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile && isValidAudioFile(droppedFile)) {
      onFileUpload(droppedFile)
    }
  }

  const handleFileInput = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile && isValidAudioFile(selectedFile)) {
      onFileUpload(selectedFile)
    }
  }

  const isValidAudioFile = (file) => {
    const validTypes = ['audio/wav', 'audio/mpeg', 'audio/mp3', 'audio/mp4', 'audio/x-m4a']
    const validExtensions = ['.wav', '.mp3', '.m4a', '.aac']
    const fileExtension = file.name.toLowerCase().slice(file.name.lastIndexOf('.'))
    
    return validTypes.includes(file.type) || validExtensions.includes(fileExtension)
  }

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  return (
    <div className={`backdrop-blur-xl bg-gray-900/40 border ${borderColor || 'border-gray-800/50'} rounded-2xl p-6 hover:border-indigo-500/30 transition-all duration-300`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${iconColor || 'from-indigo-500 to-purple-600'} flex items-center justify-center`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-white font-semibold">{title}</h3>
            <p className="text-sm text-gray-500">{subtitle}</p>
          </div>
        </div>
        {file && (
          <button
            onClick={onRemove}
            className="w-8 h-8 rounded-lg bg-red-500/20 hover:bg-red-500/30 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-red-400" />
          </button>
        )}
      </div>
      
      {!file ? (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="border-2 border-dashed border-gray-700 rounded-xl p-12 text-center hover:border-indigo-500/50 transition-all duration-300 cursor-pointer group relative"
        >
          <input
            type="file"
            accept="audio/*,.mp3,.wav,.m4a,.aac"
            onChange={handleFileInput}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <Upload className="w-12 h-12 text-gray-600 mx-auto mb-4 group-hover:text-indigo-400 transition-colors" />
          <p className="text-gray-400 mb-2">Drop your audio file here or click to browse</p>
          <p className="text-sm text-gray-600">Supports: WAV, MP3, M4A (Max 50MB)</p>
        </div>
      ) : (
        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium truncate">{file.name}</p>
              <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AudioUploader
