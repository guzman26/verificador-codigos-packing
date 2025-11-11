let htmlAudioElement: HTMLAudioElement | null = null;
let audioContext: AudioContext | null = null;
let decodedErrorBuffer: AudioBuffer | null = null;
let defaultErrorBeepGain = 5.0;
let defaultSuccessBeepGain = 0.3;

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

export function setSuccessBeepGain(gain: number): void {
  if (Number.isFinite(gain)) {
    defaultSuccessBeepGain = Math.max(0.1, Math.min(1.0, gain));
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

/**
 * Reproduce un sonido de éxito agradable usando tonos sintéticos
 * Dos tonos ascendentes: C5 (523Hz) y E5 (659Hz)
 */
export async function playSuccessBeep(): Promise<void> {
  try {
    const ctx = await ensureAudioContext();
    
    // Primer tono (C5 - Do)
    const oscillator1 = ctx.createOscillator();
    const gainNode1 = ctx.createGain();
    
    oscillator1.type = 'sine';
    oscillator1.frequency.value = 523.25; // C5
    
    gainNode1.gain.value = 0;
    gainNode1.gain.setValueAtTime(0, ctx.currentTime);
    gainNode1.gain.linearRampToValueAtTime(defaultSuccessBeepGain, ctx.currentTime + 0.01);
    gainNode1.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
    
    oscillator1.connect(gainNode1);
    gainNode1.connect(ctx.destination);
    
    oscillator1.start(ctx.currentTime);
    oscillator1.stop(ctx.currentTime + 0.15);
    
    // Segundo tono (E5 - Mi) - ligeramente después
    const oscillator2 = ctx.createOscillator();
    const gainNode2 = ctx.createGain();
    
    oscillator2.type = 'sine';
    oscillator2.frequency.value = 659.25; // E5
    
    gainNode2.gain.value = 0;
    gainNode2.gain.setValueAtTime(0, ctx.currentTime + 0.08);
    gainNode2.gain.linearRampToValueAtTime(defaultSuccessBeepGain, ctx.currentTime + 0.09);
    gainNode2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
    
    oscillator2.connect(gainNode2);
    gainNode2.connect(ctx.destination);
    
    oscillator2.start(ctx.currentTime + 0.08);
    oscillator2.stop(ctx.currentTime + 0.25);
    
  } catch (error) {
    // Si falla el Web Audio API, no hacer nada (fail silently)
    console.debug('Could not play success sound:', error);
  }
}

// Alias para compatibilidad
export const playSuccessSound = playSuccessBeep;
