import React, { ReactElement } from "react";
import { Image, StyleSheet } from "react-native";
import logo from "../../assets/logo.png";

const styles = StyleSheet.create({
  image: {
    width: 128,
    height: 128,
    marginBottom: 12,
    borderRadius: 5,
  },
});

const Logo = (): ReactElement => <Image source={logo} style={styles.image} />;

export default Logo;
