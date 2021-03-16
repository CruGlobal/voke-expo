import React, { ReactElement, useEffect, useState } from "react";
import { Text, StyleSheet, Dimensions } from "react-native";
import { useTranslation } from "react-i18next";
import { useRoute } from "@react-navigation/native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import * as ScreenOrientation from "expo-screen-orientation";
import { ActivityIndicator } from "react-native-paper";
import Background from "../../../components/Background";
import theme from "../../../core/theme";
import VideoPlayer from "../../../components/VideoPlayer";

const styles = StyleSheet.create({
  safeAreaView: {
    backgroundColor: "#000",
    flex: 1,
  },
  video: {
    height: Dimensions.get("window").width / (16 / 9),
    width: Dimensions.get("window").width,
  },
});

const ListScreen = (): ReactElement => {
  const { t } = useTranslation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const [orientation, setOrientation] = useState(
    ScreenOrientation.Orientation.PORTRAIT_UP,
  );

  useEffect(() => {
    ScreenOrientation.getOrientationAsync().then((initialOrientation) => {
      setOrientation(initialOrientation);
    });

    const subscription = ScreenOrientation.addOrientationChangeListener(
      (evt) => {
        setOrientation(evt.orientationInfo.orientation);
      },
    );

    return () =>
      ScreenOrientation.removeOrientationChangeListener(subscription);
  }, [orientation]);

  const fullscreen =
    orientation === ScreenOrientation.Orientation.LANDSCAPE_RIGHT;

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <VideoPlayer
        videoProps={{
          source: {
            uri: route.params.hlsUrl,
          },
          shouldPlay: true,
          resizeMode: "contain",
        }}
        sliderColor={theme.colors.primary}
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
        switchToLandscape={() =>
          ScreenOrientation.lockAsync(
            ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT,
          )
        }
        switchToPortrait={() =>
          ScreenOrientation.lockAsync(
            ScreenOrientation.OrientationLock.PORTRAIT_UP,
          )
        }
        inFullscreen={fullscreen}
        spinner={() => <ActivityIndicator />}
      />
      <Background>
        <Text>{t("hello")}</Text>
      </Background>
    </SafeAreaView>
  );
};

export default ListScreen;
