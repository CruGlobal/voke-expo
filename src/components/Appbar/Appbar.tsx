import React, { ReactElement } from "react";
import { Appbar as PaperAppbar } from "react-native-paper";
import { StackHeaderProps } from "@react-navigation/stack";
import { TouchableOpacity } from "react-native-gesture-handler";
import theme from "../../core/theme";
import apolloClient from "../../core/apolloClient";
import firebaseClient, { Auth } from "../../core/firebaseClient";
import Avatar from "../Avatar";

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
    <PaperAppbar.Header theme={{ colors: { primary: theme.colors.surface } }}>
      {previous ? (
        <PaperAppbar.BackAction
          onPress={() => {
            navigation.pop();
          }}
          color={theme.colors.primary}
        />
      ) : (
        <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
          <Avatar photoURL={user?.photoURL} displayName={user?.displayName} />
        </TouchableOpacity>
      )}
      <PaperAppbar.Content title={previous ? title : "Voke"} />
      {user && (
        <PaperAppbar.Action icon="logout" onPress={handleLogoutPressed} />
      )}
    </PaperAppbar.Header>
  );
};

export default Appbar;
