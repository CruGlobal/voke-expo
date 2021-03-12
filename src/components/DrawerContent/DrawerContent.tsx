import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItem,
} from "@react-navigation/drawer";
import React, { ReactElement } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Drawer, Title, useTheme } from "react-native-paper";
import Animated from "react-native-reanimated";
import { Auth } from "../../core/firebaseClient";
import apolloClient from "../../core/apolloClient";
import Avatar from "../Avatar";

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  userInfoSection: {
    paddingLeft: 20,
  },
  title: {
    marginTop: 20,
    fontWeight: "bold",
  },
  section: {
    marginTop: 15,
  },
});

const DrawerContent = ({
  progress,
  navigation,
  user,
  ...props
}: DrawerContentComponentProps): ReactElement => {
  const paperTheme = useTheme();

  const translateX = Animated.interpolate(progress, {
    inputRange: [0, 0.5, 0.7, 0.8, 1],
    outputRange: [-100, -85, -70, -45, 0],
  });

  const handleLogoutPressed = async (): Promise<void> => {
    await apolloClient.resetStore();
    await Auth.signOut();
  };

  return (
    <DrawerContentScrollView {...props}>
      <Animated.View
        style={[
          styles.drawerContent,
          {
            backgroundColor: paperTheme.colors.surface,
            transform: [{ translateX }],
          },
        ]}
      >
        <View style={styles.userInfoSection}>
          <TouchableOpacity
            onPress={() => {
              navigation.toggleDrawer();
            }}
          >
            <Avatar
              photoURL={Auth.currentUser?.photoURL}
              displayName={Auth.currentUser?.displayName}
              size={50}
              margin={0}
            />
          </TouchableOpacity>
          <Title style={styles.title}>{Auth.currentUser?.displayName}</Title>
        </View>
        <Drawer.Section style={styles.section}>
          <DrawerItem
            icon={({ color, size }) => (
              <MaterialCommunityIcons
                name="account-outline"
                color={color}
                size={size}
              />
            )}
            label="Profile"
            onPress={() => navigation.navigate("Profile")}
          />
          <DrawerItem
            icon={({ color, size }) => (
              <MaterialCommunityIcons name="tune" color={color} size={size} />
            )}
            label="Preferences"
            onPress={() => console.log("preferences")}
          />
          <DrawerItem
            icon={({ color, size }) => (
              <MaterialCommunityIcons
                name="bookmark-outline"
                color={color}
                size={size}
              />
            )}
            label="Bookmarks"
            onPress={() => console.log("bookmarks")}
          />
          {user && (
            <DrawerItem
              icon={({ color, size }) => (
                <MaterialCommunityIcons
                  name="logout"
                  color={color}
                  size={size}
                />
              )}
              label="Logout"
              onPress={handleLogoutPressed}
            />
          )}
        </Drawer.Section>
      </Animated.View>
    </DrawerContentScrollView>
  );
};

export default DrawerContent;
