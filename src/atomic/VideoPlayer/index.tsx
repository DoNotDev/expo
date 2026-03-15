// packages/expo/src/atomic/VideoPlayer/index.tsx
/**
 * @fileoverview VideoPlayer component
 * @description Video player component using expo-av
 *
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */

import { Video, ResizeMode } from 'expo-av';
import { useEffect, useRef } from 'react';
import { View, type ViewStyle } from 'react-native';

import { mergeStyles } from '../../utils/helpers';

/**
 * Video configuration interface
 */
export interface VideoConfig {
  uri: string;
  poster?: string;
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
}

/**
 * VideoPlayer component props interface
 */
export interface VideoPlayerProps {
  /**
   * Video source URI
   */
  source: string | VideoConfig;
  /**
   * Whether video should autoplay
   * @default false
   */
  autoplay?: boolean;
  /**
   * Whether video should loop
   * @default false
   */
  loop?: boolean;
  /**
   * Whether video should be muted
   * @default false
   */
  muted?: boolean;
  /**
   * Content fit mode
   * @default 'contain'
   */
  resizeMode?: 'contain' | 'cover' | 'fill';
  /**
   * Additional style
   */
  style?: ViewStyle;
  /**
   * Test ID for testing
   */
  testID?: string;
}

/**
 * Video player component.
 *
 * @component
 * @example
 * ```tsx
 * <VideoPlayer source="https://example.com/video.mp4" />
 * ```
 */
const VideoPlayer = ({
  source,
  autoplay = false,
  loop = false,
  muted = false,
  resizeMode = 'contain',
  style,
  testID,
}: VideoPlayerProps) => {
  const uri = typeof source === 'string' ? source : source.uri;

  const videoRef = useRef<Video | null>(null);

  useEffect(() => {
    const applyConfig = async () => {
      const instance = videoRef.current;
      if (!instance) return;

      await instance.setIsLoopingAsync(loop);
      await instance.setIsMutedAsync(muted);
      if (autoplay) {
        await instance.playAsync();
      }
    };

    void applyConfig();
  }, [uri, autoplay, loop, muted]);

  const resizeModeMap: Record<
    NonNullable<VideoPlayerProps['resizeMode']>,
    ResizeMode
  > = {
    contain: ResizeMode.CONTAIN,
    cover: ResizeMode.COVER,
    fill: ResizeMode.STRETCH,
  };

  return (
    <View
      style={mergeStyles({ width: '100%', height: 200 }, style)}
      testID={testID}
    >
      <Video
        ref={videoRef}
        source={{ uri }}
        resizeMode={resizeModeMap[resizeMode]}
        isMuted={muted}
        isLooping={loop}
        shouldPlay={autoplay}
        style={{ width: '100%', height: '100%' }}
        testID={testID ? `${testID}-video` : undefined}
      />
    </View>
  );
};

export default VideoPlayer;
