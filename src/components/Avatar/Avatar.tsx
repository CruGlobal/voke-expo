import React, { ReactElement } from "react";
import { Avatar as PaperAvatar } from "react-native-paper";

interface AvatarProps {
  photoURL: string | null | undefined;
  displayName: string | null | undefined;
  size?: number;
}

const Avatar = ({
  photoURL,
  displayName,
  size = 40,
}: AvatarProps): ReactElement => {
  return (
    <>
      {photoURL ? (
        <PaperAvatar.Image size={size} source={{ uri: photoURL }} />
      ) : (
        <>
          {displayName ? (
            <PaperAvatar.Text
              size={size}
              label={displayName.match(/\b(\w)/g)?.join("") || ""}
            />
          ) : (
            <PaperAvatar.Icon size={size} icon="account" />
          )}
        </>
      )}
    </>
  );
};

export default Avatar;
