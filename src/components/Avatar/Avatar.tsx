import React, { ReactElement } from "react";
import { Avatar as PaperAvatar } from "react-native-paper";
import { IconSource } from "react-native-paper/lib/typescript/components/Icon";
import { StyleSheet } from "react-native";
import theme from "../../core/theme";

const styles = StyleSheet.create({
  avatar: {
    backgroundColor: theme.colors.secondary,
    margin: 6,
  },
  image: {
    resizeMode: "contain",
    height: 20,
  },
});

interface AvatarProps {
  photoURL: string | null | undefined;
  displayName: string | null | undefined;
  size?: number;
  icon?: IconSource;
  margin?: number;
}

const Avatar = ({
  photoURL,
  displayName,
  size = 48,
  icon = "account",
  margin = 6,
}: AvatarProps): ReactElement => {
  return (
    <>
      {photoURL ? (
        <PaperAvatar.Image
          size={size - 6}
          source={{ uri: photoURL }}
          style={styles.avatar}
        />
      ) : (
        <>
          {displayName ? (
            <PaperAvatar.Text
              size={size - margin * 2}
              label={
                displayName
                  .match(/\b(\w)/g)
                  ?.join("")
                  .toUpperCase() || ""
              }
              color={theme.colors.surface}
              style={[styles.avatar, { margin }]}
            />
          ) : (
            <PaperAvatar.Icon
              size={size - margin * 2}
              icon={icon}
              color={theme.colors.surface}
              style={[styles.avatar, { margin }]}
            />
          )}
        </>
      )}
    </>
  );
};

export default Avatar;
