import React, { ReactElement } from "react";
import { Appbar as PaperAppbar } from "react-native-paper";
import { StackHeaderProps } from "@react-navigation/stack";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Image, StyleSheet } from "react-native";
import theme from "../../core/theme";
import { Auth } from "../../core/firebaseClient";
import Avatar from "../Avatar";
import logo from "../../assets/logo-white.png";

const styles = StyleSheet.create({
  image: {
    flexGrow: 1,
    resizeMode: "contain",
    height: 24,
  },
});

const Appbar = ({
  scene,
  previous,
  navigation,
}: StackHeaderProps): ReactElement => {
  const { options } = scene.descriptor;

  let title;

  if (options.headerTitle !== undefined) {
    title = options.headerTitle;
  } else if (options.title !== undefined) {
    title = options.title;
  } else {
    title = scene.route.name;
  }
  return (
    <PaperAppbar.Header
      style={{
        backgroundColor: previous ? theme.colors.surface : theme.colors.primary,
      }}
      dark={!previous}
    >
      {previous ? (
        <PaperAppbar.BackAction
          onPress={() => {
            navigation.pop();
          }}
        />
      ) : (
        <TouchableOpacity
          onPress={() =>
            ((navigation as unknown) as { openDrawer: () => void }).openDrawer()
          }
        >
          <Avatar
            photoURL={Auth.currentUser?.photoURL}
            displayName={Auth.currentUser?.displayName}
          />
        </TouchableOpacity>
      )}
      {previous ? (
        <PaperAppbar.Content title={title} />
      ) : (
        <Image source={logo} style={styles.image} />
      )}
      {Auth.currentUser && (
        <PaperAppbar.Action
          icon="bell"
          onPress={() => navigation.navigate("Notifications")}
        />
      )}
    </PaperAppbar.Header>
  );
};

export default Appbar;
