import { ApolloProvider } from "@apollo/client";
import { StatusBar } from "expo-status-bar";
import React, { ReactElement } from "react";
import { Provider as PaperProvider } from "react-native-paper";
import RootNavigator from "./src/components/RootNavigator";
import apolloClient from "./src/core/apolloClient";
import theme from "./src/core/theme";

export default function App(): ReactElement {
  return (
    <ApolloProvider client={apolloClient}>
      <PaperProvider theme={theme}>
        <StatusBar style="dark" />
        <RootNavigator />
      </PaperProvider>
    </ApolloProvider>
  );
}
