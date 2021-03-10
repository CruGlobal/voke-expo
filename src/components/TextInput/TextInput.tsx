import React, { ReactElement } from "react";
import { View, StyleSheet, Text } from "react-native";
import { TextInput as Input } from "react-native-paper";
import theme from "../../core/theme";

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginVertical: 12,
  },
  input: {
    backgroundColor: theme.colors.surface,
  },
  error: {
    fontSize: 14,
    color: theme.colors.error,
    paddingHorizontal: 4,
    paddingTop: 4,
  },
});

type Props = React.ComponentProps<typeof Input> & { errorText?: string };

const TextInput = ({ error, errorText, ...props }: Props): ReactElement => (
  <View style={styles.container}>
    <Input
      style={styles.input}
      selectionColor={theme.colors.primary}
      underlineColor="transparent"
      mode="outlined"
      error={error}
      {...props}
    />
    {error && errorText ? <Text style={styles.error}>{errorText}</Text> : null}
  </View>
);

export default TextInput;
