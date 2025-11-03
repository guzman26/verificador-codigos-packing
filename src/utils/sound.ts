let htmlAudioElement: HTMLAudioElement | null = null;
let audioContext: AudioContext | null = null;
let decodedErrorBuffer: AudioBuffer | null = null;
let defaultErrorBeepGain = 5.0;

async function ensureAudioContext(): Promise<AudioContext> {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  }
  if (audioContext.state === 'suspended') {
    try {
      await audioContext.resume();
    } catch {
      // ignore
    }
  }
  return audioContext;
}

async function ensureDecodedErrorBuffer(): Promise<AudioBuffer | null> {
  if (decodedErrorBuffer) return decodedErrorBuffer;
  try {
    const ctx = await ensureAudioContext();
    const resp = await fetch('/error-126627.mp3', { cache: 'force-cache' });
    const arr = await resp.arrayBuffer();
    decodedErrorBuffer = await ctx.decodeAudioData(arr);
    return decodedErrorBuffer;
  } catch {
    return null;
  }
}

export function setErrorBeepGain(gain: number): void {
  if (Number.isFinite(gain)) {
    defaultErrorBeepGain = Math.max(0.1, Math.min(6.0, gain));
  }
}

export async function playErrorBeep(): Promise<void> {
  try {
    const buffer = await ensureDecodedErrorBuffer();
    const ctx = audioContext;
    if (buffer && ctx) {
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      const gainNode = ctx.createGain();
      gainNode.gain.value = defaultErrorBeepGain;
      const compressor = ctx.createDynamicsCompressor();
      compressor.threshold.value = -10;
      compressor.knee.value = 24;
      compressor.ratio.value = 6;
      compressor.attack.value = 0.005;
      compressor.release.value = 0.1;
      source.connect(gainNode);
      gainNode.connect(compressor);
      compressor.connect(ctx.destination);
      source.start(0);
      return;
    }
  } catch {
    // fallback
  }

  try {
    if (!htmlAudioElement) {
      htmlAudioElement = new Audio('/error-126627.mp3');
      htmlAudioElement.preload = 'auto';
    }
    htmlAudioElement.currentTime = 0;
    htmlAudioElement.volume = 1.0;
    void htmlAudioElement.play();
  } catch {
    // no-op
  }
}

// Alias para compatibilidad
export const playErrorSound = playErrorBeep;
