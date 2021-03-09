import React, { ReactElement } from "react";
import { Appbar as PaperAppbar } from "react-native-paper";
import { StackHeaderProps } from "@react-navigation/stack";
import theme from "../../core/theme";

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
    <PaperAppbar.Header theme={{ colors: { primary: theme.colors.surface } }}>
      {previous && (
        <PaperAppbar.BackAction
          onPress={() => {
            navigation.pop();
          }}
          color={theme.colors.primary}
        />
      )}
      <PaperAppbar.Content title={previous ? title : "Voke"} />
    </PaperAppbar.Header>
  );
};

export default Appbar;
