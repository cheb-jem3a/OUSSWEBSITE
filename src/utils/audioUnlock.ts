/**
 * Audio Context Unlocker
 * Activates browser audio subsystem synchronously during user click gestures.
 * This guarantees modern browsers (Chrome, Edge, Safari) recognize the user gesture
 * and allow unmuted audio playback across client-side page transitions.
 */
let sharedAudioCtx: AudioContext | null = null;

export function unlockAudio(): void {
  try {
    const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtxClass) return;

    if (!sharedAudioCtx || sharedAudioCtx.state === 'closed') {
      sharedAudioCtx = new AudioCtxClass();
    }

    if (sharedAudioCtx.state === 'suspended') {
      sharedAudioCtx.resume().catch(() => {});
    }

    // Play a 1ms inaudible buffer to permanently unlock the audio pipeline on mobile/desktop
    const buffer = sharedAudioCtx.createBuffer(1, 1, 22050);
    const source = sharedAudioCtx.createBufferSource();
    source.buffer = buffer;
    source.connect(sharedAudioCtx.destination);
    source.start(0);
  } catch {
    // Ignore environments where Web Audio is restricted
  }
}
