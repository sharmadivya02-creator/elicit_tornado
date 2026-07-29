// Native Web Audio API Synthesizer for Retro Chiptune SFX
let audioCtx: AudioContext | null = null;

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {/* autoplay policy — user interaction required */});
  }
  return audioCtx;
}

export function playSound(type: 'click' | 'hover' | 'success' | 'levelup' | 'laser' | 'coin' | 'warp' | 'explosion', enabled: boolean) {
  if (!enabled) return;
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    switch (type) {
      case 'explosion': {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(160, now);
        osc.frequency.linearRampToValueAtTime(20, now + 0.3);

        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.3);
        break;
      }
      case 'hover': {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.05);

        gain.gain.setValueAtTime(0.02, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.05);
        break;
      }
      case 'click': {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(587.33, now); // D5
        osc.frequency.setValueAtTime(880, now + 0.04); // A5

        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.1);
        break;
      }
      case 'coin': {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        // Classic coin sound: 2 quick ascending notes
        osc.frequency.setValueAtTime(987.77, now); // B5
        osc.frequency.setValueAtTime(1318.51, now + 0.08); // E6

        gain.gain.setValueAtTime(0.06, now);
        gain.gain.setValueAtTime(0.06, now + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.25);
        break;
      }
      case 'success': {
        // Star reward arpeggio
        const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
        notes.forEach((freq, index) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'square';
          osc.frequency.setValueAtTime(freq, now + index * 0.07);

          gain.gain.setValueAtTime(0.04, now + index * 0.07);
          gain.gain.exponentialRampToValueAtTime(0.001, now + index * 0.07 + 0.2);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + index * 0.07);
          osc.stop(now + index * 0.07 + 0.2);
        });
        break;
      }
      case 'levelup': {
        // Big retro level up fanfare
        const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50, 1318.51];
        notes.forEach((freq, index) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(freq, now + index * 0.05);

          gain.gain.setValueAtTime(0.03, now + index * 0.05);
          gain.gain.exponentialRampToValueAtTime(0.001, now + index * 0.05 + 0.3);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + index * 0.05);
          osc.stop(now + index * 0.05 + 0.3);
        });
        break;
      }
      case 'laser': {
        // Laser sweep downward
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(1500, now);
        osc.frequency.exponentialRampToValueAtTime(100, now + 0.18);

        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.18);
        break;
      }
      case 'warp': {
        // Long dynamic sweep upwards
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(200, now);
        osc.frequency.exponentialRampToValueAtTime(2000, now + 0.5);

        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(0.05, now + 0.25);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.5);
        break;
      }
    }
  } catch (e) {
    console.error('Audio synthesis failed', e);
  }
}

// Simple periodic retro-chiptune synthesizer loop
let backgroundMusicInterval: number | null = null;
let currentOscillators: OscillatorNode[] = [];

export function stopBackgroundMusic() {
  if (backgroundMusicInterval) {
    clearInterval(backgroundMusicInterval);
    backgroundMusicInterval = null;
  }
  currentOscillators.forEach(osc => {
    try {
      osc.stop();
    } catch (e) {}
  });
  currentOscillators = [];
}

export function startBackgroundMusic(enabled: boolean) {
  stopBackgroundMusic();
  if (!enabled) return;

  try {
    const ctx = getAudioContext();
    const chords = [
      [130.81, 164.81, 196.00], // C3 Major: C, E, G
      [146.83, 174.61, 220.00], // D3 minor: D, F, A
      [164.81, 196.00, 246.94], // E3 minor: E, G, B
      [174.61, 220.00, 261.63], // F3 Major: F, A, C
    ];
    let chordIndex = 0;

    const playChord = () => {
      const now = ctx.currentTime;
      const currentChord = chords[chordIndex];

      currentChord.forEach((freq) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.012, now + 0.5);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 2.8);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 3);
        currentOscillators.push(osc);
      });

      // Simple arpeggio melody
      const melodyNotes = [
        currentChord[0] * 4,
        currentChord[1] * 4,
        currentChord[2] * 4,
        currentChord[1] * 4 * 1.5,
      ];
      melodyNotes.forEach((freq, idx) => {
        const mOsc = ctx.createOscillator();
        const mGain = ctx.createGain();
        mOsc.type = 'sine';
        mOsc.frequency.setValueAtTime(freq, now + idx * 0.75);

        mGain.gain.setValueAtTime(0, now + idx * 0.75);
        mGain.gain.linearRampToValueAtTime(0.008, now + idx * 0.75 + 0.1);
        mGain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.75 + 0.6);

        mOsc.connect(mGain);
        mGain.connect(ctx.destination);
        mOsc.start(now + idx * 0.75);
        mOsc.stop(now + idx * 0.75 + 0.75);
        currentOscillators.push(mOsc);
      });

      chordIndex = (chordIndex + 1) % chords.length;
    };

    playChord();
    backgroundMusicInterval = window.setInterval(() => {
      // Prune already-ended oscillators to prevent unbounded array growth
      currentOscillators = currentOscillators.filter((osc) => {
        try { return osc.context.state !== 'closed'; } catch { return false; }
      });
      playChord();
    }, 3000);
  } catch (e) {
    console.error('Failed to start chiptune ambient track', e);
  }
}
