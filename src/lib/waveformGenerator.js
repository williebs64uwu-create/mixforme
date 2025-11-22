export const generateWaveformData = (audioBuffer, samples = 1000) => {
    const rawData = audioBuffer.getChannelData(0);
    const blockSize = Math.floor(rawData.length / samples);
    const filteredData = [];

    for (let i = 0; i < samples; i++) {
        const blockStart = blockSize * i;
        let sum = 0;
        for (let j = 0; j < blockSize; j++) {
            sum += Math.abs(rawData[blockStart + j]);
        }
        filteredData.push(sum / blockSize);
    }

    return filteredData;
};

export const drawWaveform = (canvas, waveformData, options = {}) => {
    const {
        color = '#8b5cf6',
        backgroundColor = '#1a1a24',
        lineWidth = 2,
        progress = 0,
        progressColor = '#a78bfa',
    } = options;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const middle = height / 2;

    // Clear canvas
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);

    // Draw waveform
    const barWidth = width / waveformData.length;
    const maxAmplitude = Math.max(...waveformData);

    for (let i = 0; i < waveformData.length; i++) {
        const x = i * barWidth;
        const amplitude = (waveformData[i] / maxAmplitude) * (height / 2) * 0.9;

        // Determine color based on progress
        const isPlayed = i / waveformData.length < progress;
        ctx.fillStyle = isPlayed ? progressColor : color;

        // Draw bar (mirrored top and bottom)
        ctx.fillRect(x, middle - amplitude, barWidth - 1, amplitude * 2);
    }

    // Draw progress line
    if (progress > 0) {
        const progressX = width * progress;
        ctx.strokeStyle = progressColor;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(progressX, 0);
        ctx.lineTo(progressX, height);
        ctx.stroke();
    }
};

export const drawFrequencySpectrum = (canvas, analyser) => {
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyser.getByteFrequencyData(dataArray);

    ctx.fillStyle = '#1a1a24';
    ctx.fillRect(0, 0, width, height);

    const barWidth = (width / bufferLength) * 2.5;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * height;

        // Create gradient for bars
        const gradient = ctx.createLinearGradient(0, height - barHeight, 0, height);
        gradient.addColorStop(0, '#8b5cf6');
        gradient.addColorStop(0.5, '#6b46c1');
        gradient.addColorStop(1, '#4c2f7a');

        ctx.fillStyle = gradient;
        ctx.fillRect(x, height - barHeight, barWidth, barHeight);

        x += barWidth + 1;
    }
};

export const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const downloadBlob = (blob, filename) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};
