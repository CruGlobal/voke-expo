import React, { ReactElement } from "react";
import { TouchableOpacity, Image, StyleSheet } from "react-native";
import { getStatusBarHeight } from "react-native-status-bar-height";
import arrowBack from "../../assets/arrow_back.png";

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 10 + getStatusBarHeight(),
    left: 10,
  },
  image: {
    width: 24,
    height: 24,
  },
});

type Props = {
  goBack: () => void;
};

const BackButton = ({ goBack }: Props): ReactElement => (
  <TouchableOpacity onPress={goBack} style={styles.container}>
    <Image style={styles.image} source={arrowBack} />
  </TouchableOpacity>
);

export default BackButton;
