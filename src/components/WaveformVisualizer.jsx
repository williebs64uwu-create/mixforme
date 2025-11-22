import { useEffect, useRef, useState } from 'react';
import { drawWaveform, generateWaveformData } from '../lib/waveformGenerator';

const WaveformVisualizer = ({ audioBuffer, isPlaying, currentTime, duration, onSeek }) => {
    const canvasRef = useRef(null);
    const [waveformData, setWaveformData] = useState([]);
    const [isDragging, setIsDragging] = useState(false);

    useEffect(() => {
        if (audioBuffer) {
            const data = generateWaveformData(audioBuffer, 500);
            setWaveformData(data);
        }
    }, [audioBuffer]);

    useEffect(() => {
        if (canvasRef.current && waveformData.length > 0) {
            const canvas = canvasRef.current;
            const progress = duration > 0 ? currentTime / duration : 0;

            drawWaveform(canvas, waveformData, {
                color: '#6b46c1',
                backgroundColor: '#1a1a24',
                progressColor: '#a78bfa',
                progress,
            });
        }
    }, [waveformData, currentTime, duration]);

    const handleCanvasClick = (e) => {
        if (!canvasRef.current || !onSeek) return;

        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const progress = x / rect.width;
        const seekTime = progress * duration;

        onSeek(seekTime);
    };

    const handleMouseDown = () => {
        setIsDragging(true);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleMouseMove = (e) => {
        if (!isDragging || !canvasRef.current || !onSeek) return;

        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const progress = Math.max(0, Math.min(1, x / rect.width));
        const seekTime = progress * duration;

        onSeek(seekTime);
    };

    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mouseup', handleMouseUp);
            window.addEventListener('mousemove', handleMouseMove);

            return () => {
                window.removeEventListener('mouseup', handleMouseUp);
                window.removeEventListener('mousemove', handleMouseMove);
            };
        }
    }, [isDragging]);

    return (
        <div className="w-full">
            <canvas
                ref={canvasRef}
                width={1200}
                height={200}
                className="w-full h-auto rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                onClick={handleCanvasClick}
                onMouseDown={handleMouseDown}
                style={{ maxHeight: '200px' }}
            />

            {!audioBuffer && (
                <div className="w-full h-48 rounded-lg bg-gray-800 flex items-center justify-center">
                    <p className="text-gray-500 text-sm">Upload audio to see waveform</p>
                </div>
            )}
        </div>
    );
};

export default WaveformVisualizer;
