import { StatusBar } from "expo-status-bar";
import React, { ReactElement } from "react";
import { Provider } from "react-native-paper";
import Navigation from "./src/components/Navigation";
import theme from "./src/core/theme";

export default function App(): ReactElement {
  return (
    <Provider theme={theme}>
      <StatusBar style="dark" />
      <Navigation />
    </Provider>
  );
}
