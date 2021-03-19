import { AVPlaybackStatus, Audio, Video, VideoProps } from "expo-av";
import {
  Animated,
  Dimensions,
  GestureResponderEvent,
  LayoutChangeEvent,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  TouchableWithoutFeedback,
  View,
  StyleSheet,
} from "react-native";
import { useNetInfo } from "@react-native-community/netinfo";
import React, {
  ReactElement,
  ReactNode,
  useEffect,
  useState,
  useRef,
} from "react";
import Slider from "@react-native-community/slider";
import { MaterialIcons } from "@expo/vector-icons";
import { ActivityIndicator } from "react-native-paper";
import theme from "../../core/theme";

const styles = StyleSheet.create({
  text: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  name: {
    color: "#FFF",
    fontSize: 24,
    fontWeight: "bold",
  },
  textSemiTransparent: {
    opacity: 0.5,
  },
  overlay: {
    backgroundColor: "rgba(0,0,0,0.5)",
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
  },
  overlayInFullscreen: {
    paddingHorizontal: 40,
  },
  topBar: {
    alignSelf: "stretch",
  },
  topBarInFullscreen: {
    paddingTop: 10,
    paddingBottom: 20,
  },
  primaryControl: {
    flexGrow: 1,
    justifyContent: "center",
  },
  bottomBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    alignSelf: "stretch",
  },
  bottomBarInFullscreen: {
    paddingBottom: 30,
  },
  slider: {
    position: "absolute",
    left: -4,
    right: -4,
    bottom: -18,
  },
  sliderInFullscreen: {
    bottom: 20,
    left: 40,
    right: 40,
  },
});

const BUFFERING_SHOW_DELAY = 200;

// UI states
enum ControlStates {
  Shown = "Show",
  Showing = "Showing",
  Hidden = "Hidden",
  Hiding = "Hiding",
}

enum PlaybackStates {
  Loading = "Loading",
  Playing = "Playing",
  Paused = "Paused",
  Buffering = "Buffering",
  Error = "Error",
  Ended = "Ended",
}

enum SeekStates {
  NotSeeking = "NotSeeking",
  Seeking = "Seeking",
  Seeked = "Seeked",
}

enum ErrorSeverity {
  Fatal = "Fatal",
  NonFatal = "NonFatal",
}

type Error = {
  type: ErrorSeverity;
  message: string;
  obj: Record<string, unknown>;
};

type Props = {
  videoProps: Omit<VideoProps, "ref" | "onPlaybackStatusUpdate" | "style">;
  videoRef?: Video;
  inFullscreen: boolean;
  width?: number;
  height?: number;
  fadeInDuration?: number;
  fadeOutDuration?: number;
  quickFadeOutDuration?: number;
  hideControlsTimerDuration?: number;
  showControlsOnLoad?: boolean;
  // Callbacks
  playbackCallback?: (callback: AVPlaybackStatus) => void;
  errorCallback?: (error: Error) => void;
  switchToLandscape?: () => void;
  switchToPortrait?: () => void;
  onClose?: () => void;
  name?: string;
};

const VideoPlayer = ({
  videoProps,
  inFullscreen,
  width = Dimensions.get("window").width,
  height = Dimensions.get("window").height,
  fadeInDuration = 200,
  fadeOutDuration = 1000,
  quickFadeOutDuration = 200,
  hideControlsTimerDuration = 4000,
  errorCallback,
  playbackCallback,
  switchToLandscape,
  switchToPortrait,
  onClose,
  showControlsOnLoad = false,
  name,
}: Props): ReactElement => {
  const playbackInstance = useRef<Video>(null);
  let showingAnimation: Animated.CompositeAnimation | null = null;
  let hideAnimation: Animated.CompositeAnimation | null = null;
  let shouldPlayAtEndOfSeek = false;
  let controlsTimer: NodeJS.Timeout | null = null;

  const { isConnected } = useNetInfo();
  const [playbackState, setPlaybackState] = useState<PlaybackStates>(
    PlaybackStates.Loading,
  );
  const [
    lastPlaybackStateUpdate,
    setLastPlaybackStateUpdate,
  ] = useState<number>(Date.now());
  const [seekState, setSeekState] = useState<SeekStates>(SeekStates.NotSeeking);
  const [playbackInstancePosition, setPlaybackInstancePosition] = useState(0);
  const [playbackInstanceDuration, setPlaybackInstanceDuration] = useState(0);
  const [shouldPlay, setShouldPlay] = useState(false);
  const [error, setError] = useState("");
  const [sliderWidth, setSliderWidth] = useState(0);
  const [controlsState, setControlsState] = useState(
    showControlsOnLoad ? ControlStates.Shown : ControlStates.Hidden,
  );
  const [controlsOpacity] = useState(
    new Animated.Value(showControlsOnLoad ? 1 : 0),
  );

  // Set audio mode to play even in silent mode (like the YouTube app)
  const setAudio = async () => {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
        playThroughEarpieceAndroid: false,
        staysActiveInBackground: false,
      });
    } catch (e) {
      errorCallback?.({
        type: ErrorSeverity.NonFatal,
        message: "setAudioModeAsync error",
        obj: e,
      });
    }
  };

  useEffect(() => {
    if (!videoProps.source) {
      errorCallback?.({
        type: ErrorSeverity.Fatal,
        message: "`Source` is a required property",
        obj: {},
      });
      throw new Error("`Source` is required");
    }

    setAudio();
  });

  const hideControls = (immediately = false) => {
    if (controlsTimer) {
      clearTimeout(controlsTimer);
    }
    hideAnimation = Animated.timing(controlsOpacity, {
      toValue: 0,
      duration: immediately ? quickFadeOutDuration : fadeOutDuration,
      useNativeDriver: true,
    });
    hideAnimation.start(({ finished }) => {
      if (finished) {
        setControlsState(ControlStates.Hidden);
      }
    });
  };

  const onTimerDone = () => {
    if (
      playbackState !== PlaybackStates.Paused &&
      playbackState !== PlaybackStates.Ended
    ) {
      setControlsState(ControlStates.Hiding);
      hideControls();
    }
  };

  const resetControlsTimer = () => {
    if (controlsTimer) {
      clearTimeout(controlsTimer);
    }

    controlsTimer = setTimeout(() => onTimerDone(), hideControlsTimerDuration);
  };

  const updatePlaybackState = (newPlaybackState: PlaybackStates) => {
    if (playbackState !== newPlaybackState) {
      setPlaybackState(newPlaybackState);
      setLastPlaybackStateUpdate(Date.now());
    }
  };

  const updateSeekState = (newSeekState: SeekStates) => {
    setSeekState(newSeekState);

    // Don't keep the controls timer running when the state is seeking
    if (newSeekState === SeekStates.Seeking) {
      if (controlsTimer) clearTimeout(controlsTimer);
    } else {
      // Start the controlFs timer anew
      resetControlsTimer();
    }
  };

  const isPlayingOrBufferingOrPaused = (status: AVPlaybackStatus) => {
    if (!status.isLoaded) {
      return PlaybackStates.Error;
    }
    if (status.isPlaying) {
      return PlaybackStates.Playing;
    }
    if (status.isBuffering) {
      return PlaybackStates.Buffering;
    }

    return PlaybackStates.Paused;
  };

  const updatePlaybackCallback = (status: AVPlaybackStatus) => {
    try {
      playbackCallback?.(status);
    } catch (e) {
      errorCallback?.({
        type: ErrorSeverity.NonFatal,
        message: "Uncaught error when calling props.playbackCallback",
        obj: e,
      });
    }

    if (!status.isLoaded) {
      if (status.error) {
        updatePlaybackState(PlaybackStates.Error);
        const errorMsg = `Encountered a fatal error during playback: ${status.error}`;
        setError(errorMsg);
        errorCallback?.({
          type: ErrorSeverity.Fatal,
          message: errorMsg,
          obj: {},
        });
      }
    } else {
      // Update current position, duration, and `shouldPlay`
      setPlaybackInstancePosition(status.positionMillis || 0);
      setPlaybackInstanceDuration(status.durationMillis || 0);
      setShouldPlay(status.shouldPlay);

      // Figure out what state should be next (only if we are not seeking,
      // other the seek action handlers control the playback state, not this callback)
      if (
        seekState === SeekStates.NotSeeking &&
        playbackState !== PlaybackStates.Ended
      ) {
        if (status.didJustFinish && !status.isLooping) {
          updatePlaybackState(PlaybackStates.Ended);
        } else if (!isConnected && status.isBuffering) {
          updatePlaybackState(PlaybackStates.Error);
          setError(
            "You are probably offline." +
              "Please make sure you are connected to the Internet to watch this video",
          );
        } else {
          updatePlaybackState(isPlayingOrBufferingOrPaused(status));
        }
      }
    }
  };

  // Seeking
  const getSeekSliderPosition = () =>
    playbackInstancePosition / playbackInstanceDuration || 0;

  const onSeekSliderValueChange = async () => {
    if (playbackInstance.current && seekState !== SeekStates.Seeking) {
      updateSeekState(SeekStates.Seeking);
      // A seek might have finished (Seeked) but since we are not in NotSeeking yet, the `shouldPlay` flag is still false,
      // but we really want it be the stored value from before the previous seek
      shouldPlayAtEndOfSeek =
        seekState === SeekStates.Seeked ? shouldPlayAtEndOfSeek : shouldPlay;
      // Pause the video
      await playbackInstance.current.setStatusAsync({ shouldPlay: false });
    }
  };

  const onSeekSliderSlidingComplete = async (value: number) => {
    if (playbackInstance.current) {
      // Seeking is done, so go to Seeked, and set playbackState to Buffering
      updateSeekState(SeekStates.Seeked);
      // If the video is going to play after seek, the user expects a spinner.
      // Otherwise, the user expects the play button
      updatePlaybackState(
        shouldPlayAtEndOfSeek
          ? PlaybackStates.Buffering
          : PlaybackStates.Paused,
      );
      try {
        const playback = await playbackInstance.current.setStatusAsync({
          positionMillis: value * playbackInstanceDuration,
          shouldPlay: shouldPlayAtEndOfSeek,
        });

        // The underlying <Video> has successfully updated playback position
        // TODO: If `shouldPlayAtEndOfSeek` is false, should we still set the playbackState to Paused?
        // But because we setStatusAsync(shouldPlay: false), so the AVPlaybackStatus return value will be Paused.
        updateSeekState(SeekStates.NotSeeking);
        updatePlaybackState(isPlayingOrBufferingOrPaused(playback));
      } catch (e) {
        errorCallback?.({
          type: ErrorSeverity.NonFatal,
          message: "onSeekSliderSlidingComplete error",
          obj: e,
        });
      }
    }
  };

  const onSeekBarTap = (e: GestureResponderEvent) => {
    if (
      !(
        playbackState === PlaybackStates.Loading ||
        playbackState === PlaybackStates.Error
      )
    ) {
      const value = e.nativeEvent.locationX / sliderWidth;
      onSeekSliderValueChange();
      onSeekSliderSlidingComplete(value);
    }
  };

  // Capture the width of the seekbar slider for use in `_onSeekbarTap`
  const onSliderLayout = (e: LayoutChangeEvent) => {
    setSliderWidth(e.nativeEvent.layout.width);
  };

  // Controls view
  const getMMSSFromMillis = (millis: number) => {
    const totalSeconds = millis / 1000;
    const seconds = String(Math.floor(totalSeconds % 60));
    const minutes = String(Math.floor(totalSeconds / 60));

    return `${minutes}:${seconds.padStart(2, "0")}`;
  };

  // Controls Behavior
  const replay = async () => {
    if (playbackInstance.current) {
      await playbackInstance.current.setStatusAsync({
        shouldPlay: true,
        positionMillis: 0,
      });

      // Update playbackState to get out of Ended state
      setPlaybackState(PlaybackStates.Playing);
    }
  };

  const showControls = () => {
    showingAnimation = Animated.timing(controlsOpacity, {
      toValue: 1,
      duration: fadeInDuration,
      useNativeDriver: true,
    });

    showingAnimation.start(({ finished }) => {
      if (finished) {
        setControlsState(ControlStates.Shown);
        resetControlsTimer();
      }
    });
  };

  const togglePlay = async () => {
    if (controlsState === ControlStates.Hidden) {
      showControls();
      return;
    }
    const shouldPlayVideo = playbackState !== PlaybackStates.Playing;
    if (playbackInstance.current) {
      await playbackInstance.current.setStatusAsync({
        shouldPlay: shouldPlayVideo,
      });
    }
  };

  const toggleControls = () => {
    switch (controlsState) {
      case ControlStates.Shown:
        // If the controls are currently Shown, a tap should hide controls quickly
        setControlsState(ControlStates.Hiding);
        hideControls(true);
        break;
      case ControlStates.Hidden:
        // If the controls are currently, show controls with fade-in animation
        showControls();
        setControlsState(ControlStates.Showing);
        break;
      case ControlStates.Hiding:
        // If controls are fading out, a tap should reverse, and show controls
        setControlsState(ControlStates.Showing);
        showControls();
        break;
      case ControlStates.Showing:
        // A tap when the controls are fading in should do nothing
        break;
      default:
    }
  };

  const screenRatio = width / height;

  let videoHeight = height;
  let videoWidth = videoHeight * screenRatio;

  if (videoWidth > width) {
    videoWidth = width;
    videoHeight = videoWidth / screenRatio;
  }

  const Control = ({
    onPress,
    children,
    ...otherProps
  }: {
    onPress: () => void;
    children: ReactNode;
    otherProps?: TouchableOpacityProps;
  }) => (
    <TouchableOpacity
      {...otherProps}
      hitSlop={{ top: 20, left: 20, bottom: 20, right: 20 }}
      onPress={() => {
        resetControlsTimer();
        onPress();
      }}
    >
      <View>{children}</View>
    </TouchableOpacity>
  );

  return (
    <TouchableWithoutFeedback onPress={toggleControls}>
      <View>
        <Video
          {...videoProps}
          ref={playbackInstance}
          onPlaybackStatusUpdate={updatePlaybackCallback}
          style={{
            width: videoWidth,
            height: videoHeight,
            backgroundColor: "#000",
          }}
        />
        <Animated.View
          style={[
            styles.overlay,
            { opacity: controlsOpacity },
            inFullscreen && styles.overlayInFullscreen,
          ]}
          pointerEvents={
            controlsState === ControlStates.Hidden ? "none" : "auto"
          }
        >
          <View
            style={[styles.topBar, inFullscreen && styles.topBarInFullscreen]}
          >
            {inFullscreen ? (
              <Text style={styles.name}>{name}</Text>
            ) : (
              <Control onPress={() => onClose?.()}>
                <MaterialIcons
                  name="keyboard-arrow-down"
                  size={30}
                  color="#fff"
                />
              </Control>
            )}
          </View>
          <View style={styles.primaryControl}>
            {/* Spinner */}
            {((playbackState === PlaybackStates.Buffering &&
              Date.now() - lastPlaybackStateUpdate > BUFFERING_SHOW_DELAY) ||
              playbackState === PlaybackStates.Loading) && (
              <ActivityIndicator color={theme.colors.primary} size="large" />
            )}

            {/* Play/pause buttons */}
            {seekState !== SeekStates.Seeking &&
              (playbackState === PlaybackStates.Playing ||
                playbackState === PlaybackStates.Paused) && (
                <Control onPress={togglePlay}>
                  {/* Due to rerendering, we have to split them */}
                  {playbackState === PlaybackStates.Playing && (
                    <MaterialIcons name="pause" size={75} color="#fff" />
                  )}
                  {playbackState === PlaybackStates.Paused && (
                    <MaterialIcons name="play-arrow" size={75} color="#fff" />
                  )}
                </Control>
              )}
            {seekState === SeekStates.Seeking &&
              (playbackState === PlaybackStates.Playing ||
                playbackState === PlaybackStates.Paused) && (
                <Control onPress={replay}>
                  <MaterialIcons name="fast-forward" size={75} color="#fff" />
                </Control>
              )}

            {/* Replay button to show at the end of a video */}
            {playbackState === PlaybackStates.Ended && (
              <Control onPress={replay}>
                <MaterialIcons name="replay" size={75} color="#fff" />
              </Control>
            )}

            {/* Error display */}
            {playbackState === PlaybackStates.Error && (
              <View
                style={{
                  marginHorizontal: 20,
                }}
              >
                <Text style={[styles.text, { textAlign: "center" }]}>
                  {error}
                </Text>
              </View>
            )}
          </View>
          {/* Bottom bar */}

          <View
            style={[
              styles.bottomBar,
              inFullscreen && styles.bottomBarInFullscreen,
            ]}
          >
            {/* Current time / duration display */}
            <View style={{ flexDirection: "row" }}>
              <Text style={[styles.text, { marginLeft: 5 }]}>
                {getMMSSFromMillis(playbackInstancePosition)}
              </Text>
              <Text style={[styles.text, styles.textSemiTransparent]}>
                {" / "}
                {getMMSSFromMillis(playbackInstanceDuration)}
              </Text>
            </View>
            {/* Fullscreen control */}
            <Control
              onPress={() =>
                inFullscreen ? switchToPortrait?.() : switchToLandscape?.()
              }
            >
              {/* Due to rerendering, we have to split them */}
              {inFullscreen && (
                <MaterialIcons name="fullscreen-exit" size={30} color="#fff" />
              )}
              {!inFullscreen && (
                <MaterialIcons name="fullscreen" size={30} color="#fff" />
              )}
            </Control>
          </View>
        </Animated.View>
        <Animated.View
          style={[
            styles.slider,
            inFullscreen && styles.sliderInFullscreen,
            inFullscreen && {
              opacity: controlsOpacity,
            },
          ]}
        >
          <TouchableWithoutFeedback
            onLayout={onSliderLayout}
            onPress={onSeekBarTap}
          >
            <Slider
              thumbTintColor={
                controlsState === ControlStates.Hidden
                  ? "transparent"
                  : theme.colors.primary
              }
              minimumTrackTintColor={theme.colors.primary}
              value={getSeekSliderPosition()}
              onValueChange={onSeekSliderValueChange}
              onSlidingComplete={onSeekSliderSlidingComplete}
              disabled={
                controlsState === ControlStates.Hidden ||
                playbackState === PlaybackStates.Loading ||
                playbackState === PlaybackStates.Error
              }
            />
          </TouchableWithoutFeedback>
        </Animated.View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default VideoPlayer;
