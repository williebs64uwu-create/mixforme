import * as Tone from 'tone';

export const createEQ = (params = {}) => {
    const eq = new Tone.EQ3({
        low: params.low || 0,
        mid: params.mid || 0,
        high: params.high || 0,
        lowFrequency: params.lowFrequency || 400,
        highFrequency: params.highFrequency || 2500,
    });
    return eq;
};

export const createCompressor = (params = {}) => {
    const compressor = new Tone.Compressor({
        threshold: params.threshold || -24,
        ratio: params.ratio || 4,
        attack: params.attack || 0.003,
        release: params.release || 0.25,
        knee: params.knee || 30,
    });
    return compressor;
};

export const createReverb = async (params = {}) => {
    const reverb = new Tone.Reverb({
        decay: params.decay || 1.5,
        preDelay: params.preDelay || 0.01,
        wet: params.wet || 0.3,
    });
    await reverb.generate();
    return reverb;
};

export const createDelay = (params = {}) => {
    const delay = new Tone.FeedbackDelay({
        delayTime: params.delayTime || '8n',
        feedback: params.feedback || 0.3,
        wet: params.wet || 0.3,
    });
    return delay;
};

export const createLimiter = (params = {}) => {
    const limiter = new Tone.Limiter(params.threshold || -6);
    return limiter;
};

export const createFilter = (params = {}) => {
    const filter = new Tone.Filter({
        type: params.type || 'lowpass',
        frequency: params.frequency || 1000,
        Q: params.Q || 1,
    });
    return filter;
};

export const createChorus = (params = {}) => {
    const chorus = new Tone.Chorus({
        frequency: params.frequency || 1.5,
        delayTime: params.delayTime || 3.5,
        depth: params.depth || 0.7,
        wet: params.wet || 0.3,
    });
    chorus.start();
    return chorus;
};

export const createDistortion = (params = {}) => {
    const distortion = new Tone.Distortion({
        distortion: params.distortion || 0.4,
        wet: params.wet || 0.5,
    });
    return distortion;
};

// Effect presets for vocals
export const VOCAL_PRESETS = {
    presence: {
        name: 'Vocal Presence',
        eq: { low: -2, mid: 3, high: 4, lowFrequency: 200, highFrequency: 3000 },
        compressor: { threshold: -18, ratio: 4, attack: 0.005, release: 0.1 },
    },
    warm: {
        name: 'Warm & Smooth',
        eq: { low: 2, mid: 1, high: -1, lowFrequency: 250, highFrequency: 4000 },
        compressor: { threshold: -20, ratio: 3, attack: 0.01, release: 0.2 },
    },
    radio: {
        name: 'Radio Voice',
        eq: { low: -6, mid: 6, high: 2, lowFrequency: 300, highFrequency: 3500 },
        compressor: { threshold: -16, ratio: 6, attack: 0.003, release: 0.15 },
    },
    bright: {
        name: 'Bright & Airy',
        eq: { low: -1, mid: 0, high: 6, lowFrequency: 200, highFrequency: 2500 },
        compressor: { threshold: -22, ratio: 3, attack: 0.01, release: 0.25 },
    },
    podcast: {
        name: 'Podcast',
        eq: { low: 1, mid: 2, high: 1, lowFrequency: 150, highFrequency: 4000 },
        compressor: { threshold: -14, ratio: 5, attack: 0.005, release: 0.1 },
    },
};

export const applyPreset = async (trackId, presetName, audioEngine) => {
    const preset = VOCAL_PRESETS[presetName];
    if (!preset) return;

    // Remove existing effects
    const trackEffects = audioEngine.effects.get(trackId);
    if (trackEffects) {
        trackEffects.forEach((effect, id) => {
            audioEngine.removeEffect(trackId, id);
        });
    }

    // Apply new effects
    const eq = createEQ(preset.eq);
    audioEngine.addEffect(trackId, 'eq', eq);

    const compressor = createCompressor(preset.compressor);
    audioEngine.addEffect(trackId, 'compressor', compressor);
};
