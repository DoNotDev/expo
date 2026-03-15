// packages/expo/src/atomic/AudioPlayer/index.ts
/**
 * @fileoverview Audio player hook
 * @description Headless audio player hook wrapping expo-audio
 *
 * @version 0.1.0
 * @since 0.0.4
 * @author AMBROISE PARK Consulting
 */

import { useAudioPlayer } from 'expo-audio';

/**
 * Audio configuration interface
 */
export interface AudioConfig {
  /** Audio source URI */
  uri: string;
  /** Whether audio should loop */
  loop?: boolean;
  /** Whether audio should be muted */
  muted?: boolean;
  /** Volume level (0-1) */
  volume?: number;
}

/**
 * Headless audio player hook. Consumer builds their own UI.
 *
 * @example
 * ```tsx
 * const player = useAudio({ uri: 'https://example.com/audio.mp3', loop: true });
 * // player.play(), player.pause(), etc.
 * ```
 */
export function useAudio(config: AudioConfig) {
  const player = useAudioPlayer(config.uri);

  if (config.loop !== undefined) {
    player.loop = config.loop;
  }
  if (config.muted !== undefined) {
    player.muted = config.muted;
  }
  if (config.volume !== undefined) {
    player.volume = config.volume;
  }

  return player;
}
