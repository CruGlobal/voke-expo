import {
  getExpoPushTokenAsync,
  getPermissionsAsync,
  requestPermissionsAsync,
} from "expo-notifications";
import React, { ReactElement } from "react";
import { Alert } from "react-native";
import { Subheading, Title } from "react-native-paper";
import Constants from "expo-constants";
import { useNavigation } from "@react-navigation/native";
import Background from "../../../components/Background";
import Button from "../../../components/Button";

const AskScreen = (): ReactElement => {
  const navigation = useNavigation();
  const registerForPushNotificationsAsync = async () => {
    if (Constants.isDevice) {
      const { status: existingStatus } = await getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        Alert.alert("Failed to get push token for push notification!");
        return;
      }
      const token = (await getExpoPushTokenAsync()).data;
      navigation.goBack();
      return token;
    }
    Alert.alert(
      "Can't send to this device",
      "Must use physical device for Push Notifications",
    );
  };
  return (
    <Background>
      <Title>Notifications</Title>
      <Subheading style={{ textAlign: "center", paddingVertical: 20 }}>
        Notifications may include alerts, sounds and icon badges. These can be
        configured in settings.
      </Subheading>
      <Button
        mode="contained"
        onPress={() => registerForPushNotificationsAsync()}
      >
        Allow
      </Button>
    </Background>
  );
};

export default AskScreen;
