import React, { ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";
import { Card, TouchableRipple } from "react-native-paper";

const styles = StyleSheet.create({
  card: {
    marginBottom: 3,
  },
  title: {
    paddingBottom: 5,
  },
});

interface Props {
  content: {
    name: string;
    pictureLargeUrl: string;
    hlsUrl: string;
    viewsCount: number;
  };
  onPress?: () => void;
  featured?: boolean;
}

const ContentCard = ({
  content,
  onPress: handlePressed,
  featured,
}: Props): ReactElement => {
  const { t } = useTranslation();
  return (
    <TouchableRipple onPress={() => handlePressed?.()}>
      <Card style={styles.card}>
        <Card.Cover source={{ uri: content.pictureLargeUrl }} />
        <Card.Title
          title={content.name}
          subtitle={t("{{count}} views", { count: content.viewsCount })}
          style={styles.title}
        />
      </Card>
    </TouchableRipple>
  );
};

export default ContentCard;
