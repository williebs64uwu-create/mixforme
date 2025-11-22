import * as Tone from 'tone';

class AudioEngine {
    constructor() {
        this.tracks = new Map();
        this.effects = new Map();
        this.masterChannel = new Tone.Channel().toDestination();
        this.isPlaying = false;
        this.currentTime = 0;
    }

    async initialize() {
        await Tone.start();
        console.log('Audio engine initialized');
    }

    async loadTrack(id, file) {
        try {
            const arrayBuffer = await file.arrayBuffer();
            const audioBuffer = await Tone.context.decodeAudioData(arrayBuffer);

            const player = new Tone.Player(audioBuffer).connect(this.masterChannel);
            player.loop = false;

            this.tracks.set(id, {
                player,
                buffer: audioBuffer,
                name: file.name,
                duration: audioBuffer.duration,
            });

            return {
                success: true,
                duration: audioBuffer.duration,
                buffer: audioBuffer,
            };
        } catch (error) {
            console.error('Error loading track:', error);
            return { success: false, error: error.message };
        }
    }

    removeTrack(id) {
        const track = this.tracks.get(id);
        if (track) {
            track.player.dispose();
            this.tracks.delete(id);
        }
    }

    play() {
        if (this.tracks.size === 0) return;

        Tone.Transport.start();
        this.tracks.forEach(track => {
            track.player.start('+0.1', this.currentTime);
        });
        this.isPlaying = true;
    }

    pause() {
        Tone.Transport.pause();
        this.tracks.forEach(track => {
            track.player.stop();
        });
        this.isPlaying = false;
    }

    stop() {
        Tone.Transport.stop();
        this.tracks.forEach(track => {
            track.player.stop();
        });
        this.currentTime = 0;
        this.isPlaying = false;
    }

    seek(time) {
        const wasPlaying = this.isPlaying;
        this.stop();
        this.currentTime = time;
        if (wasPlaying) {
            this.play();
        }
    }

    setVolume(id, volume) {
        const track = this.tracks.get(id);
        if (track) {
            track.player.volume.value = Tone.gainToDb(volume);
        }
    }

    setMasterVolume(volume) {
        this.masterChannel.volume.value = Tone.gainToDb(volume);
    }

    addEffect(trackId, effectId, effect) {
        const track = this.tracks.get(trackId);
        if (track) {
            track.player.disconnect();
            track.player.connect(effect);
            effect.connect(this.masterChannel);

            if (!this.effects.has(trackId)) {
                this.effects.set(trackId, new Map());
            }
            this.effects.get(trackId).set(effectId, effect);
        }
    }

    removeEffect(trackId, effectId) {
        const trackEffects = this.effects.get(trackId);
        if (trackEffects) {
            const effect = trackEffects.get(effectId);
            if (effect) {
                effect.dispose();
                trackEffects.delete(effectId);
            }
        }
    }

    async exportAudio() {
        try {
            // Stop current playback
            this.stop();

            // Create offline context for rendering
            const duration = Math.max(...Array.from(this.tracks.values()).map(t => t.duration));
            const offline = new Tone.Offline((time) => {
                this.tracks.forEach(track => {
                    track.player.start(0);
                });
            }, duration);

            const buffer = await offline;

            // Convert to WAV
            const wav = this.bufferToWave(buffer, buffer.length);
            const blob = new Blob([wav], { type: 'audio/wav' });

            return blob;
        } catch (error) {
            console.error('Export error:', error);
            throw error;
        }
    }

    bufferToWave(abuffer, len) {
        const numOfChan = abuffer.numberOfChannels;
        const length = len * numOfChan * 2 + 44;
        const buffer = new ArrayBuffer(length);
        const view = new DataView(buffer);
        const channels = [];
        let offset = 0;
        let pos = 0;

        // Write WAVE header
        const setUint16 = (data) => {
            view.setUint16(pos, data, true);
            pos += 2;
        };
        const setUint32 = (data) => {
            view.setUint32(pos, data, true);
            pos += 4;
        };

        setUint32(0x46464952); // "RIFF"
        setUint32(length - 8); // file length - 8
        setUint32(0x45564157); // "WAVE"
        setUint32(0x20746d66); // "fmt " chunk
        setUint32(16); // length = 16
        setUint16(1); // PCM (uncompressed)
        setUint16(numOfChan);
        setUint32(abuffer.sampleRate);
        setUint32(abuffer.sampleRate * 2 * numOfChan); // avg. bytes/sec
        setUint16(numOfChan * 2); // block-align
        setUint16(16); // 16-bit
        setUint32(0x61746164); // "data" - chunk
        setUint32(length - pos - 4); // chunk length

        // Write interleaved data
        for (let i = 0; i < abuffer.numberOfChannels; i++) {
            channels.push(abuffer.getChannelData(i));
        }

        while (pos < length) {
            for (let i = 0; i < numOfChan; i++) {
                let sample = Math.max(-1, Math.min(1, channels[i][offset]));
                sample = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
                view.setInt16(pos, sample, true);
                pos += 2;
            }
            offset++;
        }

        return buffer;
    }

    dispose() {
        this.stop();
        this.tracks.forEach(track => track.player.dispose());
        this.effects.forEach(trackEffects => {
            trackEffects.forEach(effect => effect.dispose());
        });
        this.masterChannel.dispose();
        this.tracks.clear();
        this.effects.clear();
    }
}

export default new AudioEngine();
