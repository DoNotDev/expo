// packages/expo/src/atomic/VideoPlayer/index.tsx
/**
 * @fileoverview VideoPlayer component
 * @description Video player component using expo-video
 *
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */

import { useEffect } from 'react';

import { useVideoPlayer, VideoView } from 'expo-video';
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

  const player = useVideoPlayer(uri);

  useEffect(() => {
    player.loop = loop;
    player.muted = muted;
    if (autoplay) player.play();
  }, [player, autoplay, loop, muted]);

  return (
    <View
      style={mergeStyles({ width: '100%', height: 200 }, style)}
      testID={testID}
    >
      <VideoView
        player={player}
        contentFit={resizeMode}
        nativeControls={false}
        style={{ width: '100%', height: '100%' }}
        testID={testID ? `${testID}-video` : undefined}
      />
    </View>
  );
};

export default VideoPlayer;
