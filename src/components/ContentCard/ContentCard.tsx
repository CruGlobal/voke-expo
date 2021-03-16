import React, { ReactElement } from "react";
import { StyleSheet } from "react-native";
import { Card, TouchableRipple } from "react-native-paper";

const styles = StyleSheet.create({
  card: {
    marginBottom: 10,
  },
});

interface Props {
  content: {
    name: string;
    pictureLargeUrl: string;
    hlsUrl: string;
  };
  onPress?: () => void;
}

const ContentCard = ({
  content,
  onPress: handlePressed,
}: Props): ReactElement => {
  return (
    <TouchableRipple onPress={() => handlePressed?.()} style={styles.card}>
      <Card>
        <Card.Cover source={{ uri: content.pictureLargeUrl }} />
        <Card.Title title={content.name} />
      </Card>
    </TouchableRipple>
  );
};

export default ContentCard;
