import React, { ReactElement, useEffect } from "react";
import { Appbar as PaperAppbar, Avatar } from "react-native-paper";
import { StackHeaderProps } from "@react-navigation/stack";
import { gql, useLazyQuery } from "@apollo/client";
import theme from "../../core/theme";
import apolloClient from "../../core/apolloClient";
import firebaseClient from "../../core/firebaseClient";
import { MeAppbarQuery } from "../../../types/MeAppbarQuery";

const ME_APPBAR_QUERY = gql`
  query MeAppbarQuery {
    me {
      id
      picture
    }
  }
`;

interface AppbarProps extends StackHeaderProps {
  isSignedIn?: boolean;
}

const Appbar = ({
  scene,
  previous,
  navigation,
  isSignedIn,
}: AppbarProps): ReactElement => {
  const [loadMe, { data }] = useLazyQuery<MeAppbarQuery>(ME_APPBAR_QUERY);
  const { options } = scene.descriptor;

  const handleLogoutPressed = async (): Promise<void> => {
    await apolloClient.resetStore();
    await firebaseClient.auth().signOut();
  };
  useEffect(() => {
    if (isSignedIn) loadMe();
  }, [isSignedIn, loadMe]);

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
      {previous && (
        <PaperAppbar.BackAction
          onPress={() => {
            navigation.pop();
          }}
          color={theme.colors.primary}
        />
      )}

      {data?.me.picture && (
        <Avatar.Image
          size={40}
          source={{
            uri: data?.me.picture,
          }}
        />
      )}
      <PaperAppbar.Content title={previous ? title : "Voke"} />
      {isSignedIn && (
        <PaperAppbar.Action icon="logout" onPress={handleLogoutPressed} />
      )}
    </PaperAppbar.Header>
  );
};

export default Appbar;
