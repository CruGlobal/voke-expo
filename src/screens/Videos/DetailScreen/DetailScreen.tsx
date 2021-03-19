import React, { ReactElement, useEffect, useState } from "react";
import {
  StyleSheet,
  Dimensions,
  View,
  ScrollView,
  Share,
  Text,
} from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import * as ScreenOrientation from "expo-screen-orientation";
import { FlingGestureHandler, Directions } from "react-native-gesture-handler";
import { gql, useMutation, useQuery } from "@apollo/client";
import { useTranslation } from "react-i18next";
import { IconButton, Paragraph, Subheading, Title } from "react-native-paper";
import VideoPlayer from "../../../components/VideoPlayer";
import theme from "../../../core/theme";
import { ContentViewCreateMutation } from "../../../../types/ContentViewCreateMutation";
import { ContentLikeToggleMutation } from "../../../../types/ContentLikeToggleMutation";
import { ContentDislikeToggleMutation } from "../../../../types/ContentDislikeToggleMutation";
import { ContentQuery } from "../../../../types/ContentQuery";

const CONTENT_QUERY = gql`
  query ContentQuery($id: ID!) {
    content(id: $id) {
      id
      name
      slug
      description
      viewsCount
      likesCount
      like
      dislikesCount
      dislike
    }
  }
`;

const CONTENT_VIEW_CREATE_MUTATION = gql`
  mutation ContentViewCreateMutation($id: ID!) {
    contentViewCreate(input: { id: $id }) {
      view {
        content {
          id
          viewsCount
        }
      }
    }
  }
`;

const CONTENT_LIKE_TOGGLE_MUTATION = gql`
  mutation ContentLikeToggleMutation($id: ID!) {
    contentLikeToggle(input: { id: $id }) {
      like {
        content {
          id
          likesCount
          like
          dislikesCount
          dislike
        }
      }
    }
  }
`;

const CONTENT_DISLIKE_TOGGLE_MUTATION = gql`
  mutation ContentDislikeToggleMutation($id: ID!) {
    contentDislikeToggle(input: { id: $id }) {
      dislike {
        content {
          id
          likesCount
          like
          dislikesCount
          dislike
        }
      }
    }
  }
`;

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
  },
  titleView: {
    paddingTop: 15,
    paddingBottom: 10,
  },
  actionsView: {
    flexDirection: "row",
    paddingHorizontal: 5,
  },
  actionButton: {
    alignItems: "center",
    marginHorizontal: 15,
  },
  view: {
    paddingBottom: 15,
    paddingHorizontal: 20,
  },
  title: {
    marginVertical: 0,
  },
  subheading: {
    marginVertical: 0,
  },
});

const ListScreen = (): ReactElement => {
  const { t } = useTranslation();
  const {
    params,
  }: RouteProp<
    { params: { hlsUrl: string; slug: string } },
    "params"
  > = useRoute();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [orientation, setOrientation] = useState(
    ScreenOrientation.Orientation.PORTRAIT_UP,
  );
  const { data } = useQuery<ContentQuery>(CONTENT_QUERY, {
    variables: { id: params.slug },
  });
  const content = data?.content;
  const [contentViewCreate] = useMutation<ContentViewCreateMutation>(
    CONTENT_VIEW_CREATE_MUTATION,
    { variables: { id: params.slug } },
  );
  const [contentLikeToggle] = useMutation<ContentLikeToggleMutation>(
    CONTENT_LIKE_TOGGLE_MUTATION,
    { variables: { id: params.slug } },
  );
  const [contentDislikeToggle] = useMutation<ContentDislikeToggleMutation>(
    CONTENT_DISLIKE_TOGGLE_MUTATION,
    { variables: { id: params.slug } },
  );
  const handleContentLikeToggle = () => {
    if (!content) return;

    contentLikeToggle({
      variables: { id: params.slug },
      optimisticResponse: {
        contentLikeToggle: {
          __typename: "ContentLikeToggleMutationPayload",
          like: {
            __typename: "Like",
            content: {
              __typename: "Arclight",
              id: content.id,
              like: !content.like,
              likesCount: content.like
                ? content.likesCount - 1
                : content.likesCount + 1,
              dislike: false,
              dislikesCount: content.dislike
                ? content.dislikesCount - 1
                : content.dislikesCount,
            },
          },
        },
      },
    });
  };
  const handleContentDislikeToggle = () => {
    if (!content) return;

    contentDislikeToggle({
      variables: { id: params.slug },
      optimisticResponse: {
        contentDislikeToggle: {
          __typename: "ContentDislikeToggleMutationPayload",
          dislike: {
            __typename: "Dislike",
            content: {
              __typename: "Arclight",
              id: content.id,
              like: false,
              likesCount: content.like
                ? content.likesCount - 1
                : content.likesCount,
              dislike: !content.dislike,
              dislikesCount: content.dislike
                ? content.dislikesCount - 1
                : content.dislikesCount + 1,
            },
          },
        },
      },
    });
  };

  const fullscreen =
    orientation === ScreenOrientation.Orientation.LANDSCAPE_RIGHT ||
    orientation === ScreenOrientation.Orientation.LANDSCAPE_LEFT;

  useEffect(() => {
    ScreenOrientation.getOrientationAsync().then((initialOrientation) => {
      setOrientation(initialOrientation);
    });

    const subscription = ScreenOrientation.addOrientationChangeListener(
      (evt) => {
        setOrientation(evt.orientationInfo.orientation);
        console.log(evt.orientationInfo.orientation);
      },
    );

    contentViewCreate();

    return () => {
      ScreenOrientation.removeOrientationChangeListener(subscription);
    };
  }, [contentViewCreate]);

  const handleSwitchToLandscape = () => {
    ScreenOrientation.lockAsync(
      ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT,
    );
    navigation.setOptions({ gestureEnabled: false });
  };

  const handleSwitchToPortrait = () => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    navigation.setOptions({ gestureEnabled: true });
  };

  const handleFlingGesture = () => {
    if (fullscreen) {
      handleSwitchToPortrait();
    }
  };

  const onShare = async () => {
    if (!content) return;
    const result = await Share.share({
      title: content.name,
      url: `https://faith-adventures-web.vercel.app/contents/${content.slug}`,
    });
    if (result.action === Share.sharedAction) {
      if (result.activityType) {
        // shared with activity type of result.activityType
      } else {
        // shared
      }
    } else if (result.action === Share.dismissedAction) {
      // dismissed
    }
  };

  return (
    <SafeAreaView
      style={[styles.safeAreaView, fullscreen && { backgroundColor: "#000" }]}
    >
      <View style={{ zIndex: 1 }}>
        <FlingGestureHandler
          onHandlerStateChange={handleFlingGesture}
          direction={Directions.UP}
        >
          <View>
            <VideoPlayer
              name={content?.name}
              videoProps={{
                source: {
                  uri: params.hlsUrl,
                },
                shouldPlay: true,
                resizeMode: "contain",
              }}
              width={
                fullscreen
                  ? Dimensions.get("window").width - insets.left - insets.right
                  : Dimensions.get("window").width
              }
              height={
                fullscreen
                  ? Dimensions.get("window").height
                  : Dimensions.get("window").width / (16 / 9)
              }
              switchToLandscape={handleSwitchToLandscape}
              switchToPortrait={handleSwitchToPortrait}
              onClose={() => navigation.canGoBack() && navigation.goBack()}
              inFullscreen={fullscreen}
            />
          </View>
        </FlingGestureHandler>
      </View>
      <ScrollView
        style={{
          flex: 1,
          backgroundColor: theme.colors.surface,
          marginBottom: -insets.bottom,
          paddingBottom: insets.bottom,
        }}
      >
        {content && (
          <>
            <View style={[styles.view, styles.titleView]}>
              <Title style={styles.title}>{content.name}</Title>
              <Subheading style={styles.subheading}>
                {t("{{count}} views", { count: content.viewsCount })}
              </Subheading>
            </View>
            <View style={[styles.view, styles.actionsView]}>
              <View style={styles.actionButton}>
                <IconButton
                  icon={content.like ? "thumb-up" : "thumb-up-outline"}
                  size={20}
                  onPress={handleContentLikeToggle}
                />
                {content.likesCount > 0 && <Text>{content.likesCount}</Text>}
              </View>
              <View style={styles.actionButton}>
                <IconButton
                  icon={content.dislike ? "thumb-down" : "thumb-down-outline"}
                  size={20}
                  onPress={handleContentDislikeToggle}
                />
                {content.dislikesCount > 0 && (
                  <Text>{content.dislikesCount}</Text>
                )}
              </View>
              <View style={styles.actionButton}>
                <IconButton icon="share" size={20} onPress={onShare} />
              </View>
            </View>
            <View style={styles.view}>
              <Paragraph>{content.description}</Paragraph>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ListScreen;
