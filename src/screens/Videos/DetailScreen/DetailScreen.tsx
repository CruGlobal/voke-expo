import React, { ReactElement, useEffect, useState } from "react";
import { Text, StyleSheet, Dimensions, View, Alert } from "react-native";
import { useTranslation } from "react-i18next";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import * as ScreenOrientation from "expo-screen-orientation";
import { FlingGestureHandler, Directions } from "react-native-gesture-handler";
import VideoPlayer from "../../../components/VideoPlayer";
import theme from "../../../core/theme";

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
  },
});

const ListScreen = (): ReactElement => {
  const { t } = useTranslation();
  const {
    params,
  }: RouteProp<{ params: { hlsUrl?: string } }, "params"> = useRoute();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [orientation, setOrientation] = useState(
    ScreenOrientation.Orientation.PORTRAIT_UP,
  );
  const fullscreen =
    orientation === ScreenOrientation.Orientation.LANDSCAPE_RIGHT;

  useEffect(() => {
    ScreenOrientation.getOrientationAsync().then((initialOrientation) => {
      setOrientation(initialOrientation);
    });

    const subscription = ScreenOrientation.addOrientationChangeListener(
      (evt) => {
        setOrientation(evt.orientationInfo.orientation);
      },
    );

    return () => {
      ScreenOrientation.removeOrientationChangeListener(subscription);
    };
  }, []);

  const handleSwitchToLandscape = () => {
    ScreenOrientation.lockAsync(
      ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT,
    );
    navigation.setOptions({ gestureEnabled: false });
  };

  const handleSwitchToPortrait = () => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    navigation.setOptions({ gestureEnabled: true });
  };

  const handleFlingGesture = () => {
    Alert.alert("FLING");
    if (fullscreen) {
      handleSwitchToPortrait();
    }
  };

  return (
    <SafeAreaView
      style={[styles.safeAreaView, fullscreen && { backgroundColor: "#000" }]}
    >
      <FlingGestureHandler
        onHandlerStateChange={handleFlingGesture}
        direction={Directions.UP}
      >
        <VideoPlayer
          videoProps={{
            source: {
              uri: params.hlsUrl || "",
            },
            shouldPlay: true,
            resizeMode: "contain",
          }}
          width={
            fullscreen
              ? Dimensions.get("window").width - insets.left - insets.right
              : Dimensions.get("window").width
          }
          height={
            fullscreen
              ? Dimensions.get("window").height
              : Dimensions.get("window").width / (16 / 9)
          }
          switchToLandscape={handleSwitchToLandscape}
          switchToPortrait={handleSwitchToPortrait}
          inFullscreen={fullscreen}
        />
      </FlingGestureHandler>
      <View
        style={{
          flex: 1,
          padding: 20,
          backgroundColor: theme.colors.surface,
          marginBottom: -insets.bottom,
          paddingBottom: insets.bottom,
        }}
      >
        <Text>{t("hello")}</Text>
      </View>
    </SafeAreaView>
  );
};

export default ListScreen;
