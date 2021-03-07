import React, { ReactElement } from "react";
import {
  ImageBackground,
  StyleSheet,
  KeyboardAvoidingView,
  ImageSourcePropType,
  ImageResizeMode,
} from "react-native";
import backgroundDot from "../../assets/background_dot.png";

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
  },
  container: {
    flex: 1,
    padding: 20,
    width: "100%",
    maxWidth: 340,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
  },
});

interface Props {
  children: React.ReactNode;
  source?: ImageSourcePropType;
  resizeMode?: ImageResizeMode;
}

const Background = ({ children, source, resizeMode }: Props): ReactElement => (
  <ImageBackground
    source={source || backgroundDot}
    resizeMode={resizeMode || "repeat"}
    style={styles.background}
  >
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      {children}
    </KeyboardAvoidingView>
  </ImageBackground>
);

export default Background;
