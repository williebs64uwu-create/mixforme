// Audio Processing Presets
// Each preset defines EQ, compression, and effect settings

export const presets = {
  rap: {
    name: 'Rap/Trap',
    emoji: '🎤',
    color: 'from-red-500 to-orange-500',
    settings: {
      eq: {
        low: -2,      // Less bass (let the beat handle it)
        mid: 3,       // Boost presence
        high: 4       // Boost clarity and air
      },
      compressor: {
        threshold: -24,
        knee: 10,
        ratio: 6,
        attack: 0.003,
        release: 0.1
      },
      deEsser: {
        frequency: 7000,
        threshold: -15
      },
      effects: {
        reverb: 0.1,    // Minimal reverb (dry sound)
        delay: 0,       // No delay
        saturation: 0.2 // Slight warmth
      }
    }
  },

  pop: {
    name: 'Pop/Singing',
    emoji: '🎵',
    color: 'from-pink-500 to-purple-500',
    settings: {
      eq: {
        low: 0,       // Neutral bass
        mid: 2,       // Slight mid boost
        high: 5       // Bright and airy
      },
      compressor: {
        threshold: -20,
        knee: 6,
        ratio: 4,
        attack: 0.005,
        release: 0.15
      },
      deEsser: {
        frequency: 6500,
        threshold: -12
      },
      effects: {
        reverb: 0.25,   // Noticeable reverb
        delay: 0.15,    // Light delay
        saturation: 0.15
      }
    }
  },

  podcast: {
    name: 'Podcast',
    emoji: '🎙️',
    color: 'from-blue-500 to-cyan-500',
    settings: {
      eq: {
        low: -4,      // Cut rumble
        mid: 4,       // Strong presence boost
        high: 2       // Slight clarity
      },
      compressor: {
        threshold: -18,
        knee: 12,
        ratio: 5,
        attack: 0.01,
        release: 0.2
      },
      deEsser: {
        frequency: 8000,
        threshold: -10
      },
      effects: {
        reverb: 0,      // No reverb (dry)
        delay: 0,       // No delay
        saturation: 0.1 // Natural warmth
      }
    }
  },

  rnb: {
    name: 'R&B/Soul',
    emoji: '🎹',
    color: 'from-purple-500 to-indigo-500',
    settings: {
      eq: {
        low: 2,       // Warm low end
        mid: 1,       // Slight mid boost
        high: 3       // Smooth highs
      },
      compressor: {
        threshold: -22,
        knee: 8,
        ratio: 3.5,
        attack: 0.01,
        release: 0.25
      },
      deEsser: {
        frequency: 6000,
        threshold: -14
      },
      effects: {
        reverb: 0.3,    // Rich reverb
        delay: 0.2,     // Moderate delay
        saturation: 0.25 // Warm saturation
      }
    }
  },

  rock: {
    name: 'Rock/Metal',
    emoji: '🎸',
    color: 'from-orange-500 to-red-600',
    settings: {
      eq: {
        low: -1,      // Controlled bass
        mid: 5,       // Aggressive mids
        high: 6       // Cutting highs
      },
      compressor: {
        threshold: -16,
        knee: 4,
        ratio: 8,
        attack: 0.001,
        release: 0.05
      },
      deEsser: {
        frequency: 7500,
        threshold: -18
      },
      effects: {
        reverb: 0.15,   // Room sound
        delay: 0.1,     // Short delay
        saturation: 0.4 // Heavy saturation
      }
    }
  }
}

// Get preset by ID
export const getPreset = (presetId) => {
  return presets[presetId] || presets.rap
}

// Get all preset IDs
export const getPresetIds = () => {
  return Object.keys(presets)
}

// Get preset list for UI
export const getPresetList = () => {
  return Object.entries(presets).map(([id, preset]) => ({
    id,
    name: preset.name,
    emoji: preset.emoji,
    color: preset.color
  }))
}
