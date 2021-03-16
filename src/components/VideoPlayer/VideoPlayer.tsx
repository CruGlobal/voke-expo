import { AVPlaybackStatus, Audio, Video, VideoProps } from "expo-av";
import {
  Animated,
  Dimensions,
  GestureResponderEvent,
  ImageURISource,
  LayoutChangeEvent,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  TouchableWithoutFeedback,
  View,
  ViewProps,
  ViewStyle,
  ActivityIndicator,
  StyleSheet,
  StyleProp,
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
import theme from "../../core/theme";

const ICON_COLOR = "#FFF";
const CENTER_ICON_SIZE = 75;
const BOTTOM_BAR_ICON_SIZE = 30;

const styles = StyleSheet.create({
  materialIcons: {
    textAlign: "center",
  },
  text: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  textSemiTransparent: {
    opacity: 0.5,
  },
});

const PlayIcon = (): ReactElement => (
  <MaterialIcons
    name="play-arrow"
    size={CENTER_ICON_SIZE}
    color={ICON_COLOR}
    style={styles.materialIcons}
  />
);

const PauseIcon = (): ReactElement => (
  <MaterialIcons
    name="pause"
    size={CENTER_ICON_SIZE}
    color={ICON_COLOR}
    style={styles.materialIcons}
  />
);

const Spinner = (): ReactElement => (
  <ActivityIndicator color={ICON_COLOR} size="large" />
);

const FullscreenEnterIcon = (): ReactElement => (
  <MaterialIcons
    name="fullscreen"
    size={BOTTOM_BAR_ICON_SIZE}
    color={ICON_COLOR}
    style={styles.materialIcons}
  />
);

const FullscreenExitIcon = (): ReactElement => (
  <MaterialIcons
    name="fullscreen-exit"
    size={BOTTOM_BAR_ICON_SIZE}
    color={ICON_COLOR}
    style={styles.materialIcons}
  />
);

const ReplayIcon = (): ReactElement => (
  <MaterialIcons
    name="replay"
    size={CENTER_ICON_SIZE}
    color={ICON_COLOR}
    style={styles.materialIcons}
  />
);

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
  showControlsOnLoad = false,
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

  const centeredContentWidth = 100;
  const screenRatio = width / height;

  let videoHeight = height;
  let videoWidth = videoHeight * screenRatio;

  if (videoWidth > width) {
    videoWidth = width;
    videoHeight = videoWidth / screenRatio;
  }

  const Control = ({
    callback,
    center,
    children,
    ...otherProps
  }: {
    callback: () => void;
    center: boolean;
    children: ReactNode;
    transparent?: boolean;
    otherProps?: TouchableOpacityProps;
  }) => (
    <TouchableOpacity
      {...otherProps}
      hitSlop={{ top: 20, left: 20, bottom: 20, right: 20 }}
      onPress={() => {
        resetControlsTimer();
        callback();
      }}
    >
      <View
        style={
          center && {
            justifyContent: "center",
            width: centeredContentWidth,
            height: centeredContentWidth,
            borderRadius: centeredContentWidth,
          }
        }
      >
        {children}
      </View>
    </TouchableOpacity>
  );

  const CenteredView = ({
    children,
    style: viewStyle,
    ...otherProps
  }: {
    children?: ReactNode;
    style?: Animated.WithAnimatedValue<StyleProp<ViewStyle>>;
    otherProps?: ViewProps;
  }) => (
    <Animated.View
      {...otherProps}
      style={[
        {
          backgroundColor: "rgba(0,0,0,0.5)",
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        },
        viewStyle,
      ]}
    >
      {children}
    </Animated.View>
  );

  const ErrorText = ({ text }: { text: string }) => (
    <View
      style={{
        position: "absolute",
        top: videoHeight / 2,
        width: videoWidth - 40,
        marginRight: 20,
        marginLeft: 20,
      }}
    >
      <Text style={[styles.text, { textAlign: "center" }]}>{text}</Text>
    </View>
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
          }}
        />

        {/* Spinner */}
        {/* Due to loading Animation, it cannot use CenteredView */}
        {((playbackState === PlaybackStates.Buffering &&
          Date.now() - lastPlaybackStateUpdate > BUFFERING_SHOW_DELAY) ||
          playbackState === PlaybackStates.Loading) && (
          <View
            style={{
              position: "absolute",
              left: (videoWidth - centeredContentWidth) / 2,
              top: (videoHeight - centeredContentWidth) / 2,
              width: centeredContentWidth,
              height: centeredContentWidth,
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Spinner />
          </View>
        )}

        {/* Play/pause buttons */}
        {seekState !== SeekStates.Seeking &&
          (playbackState === PlaybackStates.Playing ||
            playbackState === PlaybackStates.Paused) && (
            <CenteredView style={{ opacity: controlsOpacity }}>
              <Control center callback={togglePlay}>
                {/* Due to rerendering, we have to split them */}
                {playbackState === PlaybackStates.Playing && <PauseIcon />}
                {playbackState === PlaybackStates.Paused && <PlayIcon />}
              </Control>
            </CenteredView>
          )}

        {/* Replay button to show at the end of a video */}
        {playbackState === PlaybackStates.Ended && (
          <CenteredView>
            <Control center callback={replay}>
              <ReplayIcon />
            </Control>
          </CenteredView>
        )}

        {/* Error display */}
        {playbackState === PlaybackStates.Error && <ErrorText text={error} />}

        {/* Bottom bar */}
        <Animated.View
          pointerEvents={
            controlsState === ControlStates.Hidden ? "none" : "auto"
          }
          style={[
            {
              position: "absolute",
              bottom: 0,
              width: videoWidth,
              opacity: controlsOpacity,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingBottom: 20,
              paddingHorizontal: 20,
            },
            inFullscreen && {
              paddingBottom: 70,
              paddingHorizontal: 60,
            },
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
            center={false}
            callback={() => {
              if (inFullscreen) {
                switchToPortrait?.();
              } else {
                switchToLandscape?.();
              }
            }}
          >
            {inFullscreen ? <FullscreenExitIcon /> : <FullscreenEnterIcon />}
          </Control>
        </Animated.View>
        {/* Seek bar */}
        <Animated.View
          style={[
            {
              position: "absolute",
              left: -15,
              bottom: -20,
              width: videoWidth + 30,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            },
            inFullscreen && {
              bottom: 30,
              left: 50,
              width: videoWidth - 100,
              opacity: controlsOpacity,
            },
          ]}
        >
          <TouchableWithoutFeedback
            onLayout={onSliderLayout}
            onPress={onSeekBarTap}
          >
            <Slider
              style={{ marginRight: 10, marginLeft: 10, flex: 1 }}
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
