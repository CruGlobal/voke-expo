import { ApolloProvider } from "@apollo/client";
import { StatusBar } from "expo-status-bar";
import React, { ReactElement } from "react";
import { Provider as PaperProvider } from "react-native-paper";
import { I18nextProvider } from "react-i18next";
import RootNavigator from "./src/components/RootNavigator";
import apolloClient from "./src/core/apolloClient";
import theme from "./src/core/theme";
import i18n from "./src/core/i18n";

export default function App(): ReactElement {
  return (
    <I18nextProvider i18n={i18n}>
      <ApolloProvider client={apolloClient}>
        <PaperProvider theme={theme}>
          <StatusBar style="light" />
          <RootNavigator />
        </PaperProvider>
      </ApolloProvider>
    </I18nextProvider>
  );
}
