import { useNavigation } from "@react-navigation/native";
import { getPermissionsAsync } from "expo-notifications";
import React, { ReactElement, useCallback, useEffect, useState } from "react";
import { View } from "react-native";
import { Avatar, Banner, Paragraph } from "react-native-paper";
import Background from "../../../components/Background";

const ListScreen = (): ReactElement => {
  const navigation = useNavigation();
  const [showNotificationsBanner, setShowNotificationsBanner] = useState(false);

  const checkNotificationsPermissions = useCallback(async () => {
    const result = await getPermissionsAsync();
    if (!result.granted && result.canAskAgain) {
      setShowNotificationsBanner(true);
      navigation.navigate("Notifications.Ask");
    }
  }, [navigation]);

  useEffect(() => {
    checkNotificationsPermissions();
  }, [checkNotificationsPermissions]);

  return (
    <View style={{ flexGrow: 1 }}>
      <Banner
        visible={showNotificationsBanner}
        actions={[
          {
            label: "Turn On",
            onPress: () => {
              navigation.navigate("Notifications.Ask");
              setShowNotificationsBanner(false);
            },
          },
        ]}
        icon={({ size }) => <Avatar.Icon icon="bell" size={size} />}
      >
        Get right back into the conversation when your friends send a new
        message. Turn Notifications on!
      </Banner>
      <Background>
        <Paragraph>Chats</Paragraph>
      </Background>
    </View>
  );
};

export default ListScreen;
