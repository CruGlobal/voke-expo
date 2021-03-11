import React, { ReactElement } from "react";
import { Appbar as PaperAppbar } from "react-native-paper";
import { StackHeaderProps } from "@react-navigation/stack";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Image, StyleSheet } from "react-native";
import theme from "../../core/theme";
import apolloClient from "../../core/apolloClient";
import firebaseClient, { Auth } from "../../core/firebaseClient";
import Avatar from "../Avatar";
import logo from "../../assets/logo-white.png";

const styles = StyleSheet.create({
  image: {
    flexGrow: 1,
    resizeMode: "contain",
    height: 24,
  },
});

interface AppbarProps extends StackHeaderProps {
  user: firebaseClient.User | null;
}

const Appbar = ({
  scene,
  previous,
  navigation,
  user,
}: AppbarProps): ReactElement => {
  const { options } = scene.descriptor;

  const handleLogoutPressed = async (): Promise<void> => {
    await apolloClient.resetStore();
    await Auth.signOut();
  };

  let title;

  if (options.headerTitle !== undefined) {
    title = options.headerTitle;
  } else if (options.title !== undefined) {
    title = options.title;
  } else {
    title = scene.route.name;
  }
  return (
    <PaperAppbar.Header theme={theme} dark>
      {previous ? (
        <PaperAppbar.BackAction
          onPress={() => {
            navigation.pop();
          }}
          color={theme.colors.surface}
        />
      ) : (
        <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
          <Avatar photoURL={user?.photoURL} displayName={user?.displayName} />
        </TouchableOpacity>
      )}
      {previous ? (
        <PaperAppbar.Content title={title} />
      ) : (
        <Image source={logo} style={styles.image} />
      )}
      {user && <PaperAppbar.Action icon="bell" onPress={handleLogoutPressed} />}
    </PaperAppbar.Header>
  );
};

export default Appbar;
