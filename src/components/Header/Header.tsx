import React, { ReactElement } from "react";
import { StyleSheet, Text } from "react-native";
import theme from "../../core/theme";

const styles = StyleSheet.create({
  header: {
    fontSize: 26,
    color: theme.colors.primary,
    fontWeight: "bold",
    paddingVertical: 14,
  },
});

type Props = {
  children: React.ReactNode;
};

const Header = ({ children }: Props): ReactElement => (
  <Text style={styles.header}>{children}</Text>
);

export default Header;
