import React, { ReactElement } from "react";
import { StyleProp, StyleSheet, Text, TextStyle } from "react-native";
import theme from "../../core/theme";

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    lineHeight: 26,
    color: theme.colors.secondary,
    textAlign: "center",
    marginBottom: 14,
  },
});

type Props = {
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
};

const Paragraph = ({ children, style }: Props): ReactElement => (
  <Text style={[styles.text, style]}>{children}</Text>
);

export default Paragraph;
