import React, { ReactElement, useEffect } from "react";
import { gql, useQuery } from "@apollo/client";
import { ScrollView, StyleSheet, View } from "react-native";
import { compact } from "lodash";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import { ActivityIndicator } from "react-native-paper";
import ContentCard from "../../../components/ContentCard";
import {
  GetContentsQuery,
  GetContentsQuery_contents_edges_node as Content,
} from "../../../../types/GetContentsQuery";
import {
  GetFeaturedContentsQuery,
  GetFeaturedContentsQuery_contents_nodes as FeaturedContent,
} from "../../../../types/GetFeaturedContentsQuery";
import Button from "../../../components/Button";
import theme from "../../../core/theme";

export const GET_FEATURED_CONTENTS_QUERY = gql`
  query GetFeaturedContentsQuery($locale: LocaleEnum) {
    contents(locale: $locale, featured: true) {
      nodes {
        id
        name
        description
        slug
        viewsCount
        ... on Arclight {
          pictureLargeUrl
          hlsUrl
        }
      }
    }
  }
`;

export const GET_CONTENTS_QUERY = gql`
  query GetContentsQuery($after: String, $locale: LocaleEnum) {
    contents(locale: $locale, first: 24, after: $after, featured: false)
      @connection(key: "contents", filter: ["locale"]) {
      edges {
        node {
          id
          name
          slug
          viewsCount
          ... on Arclight {
            pictureLargeUrl
            hlsUrl
          }
        }
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
`;

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
  },
  activityIndicatorView: {
    paddingVertical: 20,
  },
});

const ListScreen = (): ReactElement => {
  const { t, i18n } = useTranslation();
  const navigation = useNavigation();
  const {
    data: contents,
    fetchMore,
    refetch: refetchContents,
    loading: loadingContents,
  } = useQuery<GetContentsQuery>(GET_CONTENTS_QUERY, {
    variables: { locale: i18n.language?.toUpperCase() },
  });
  const {
    data: featuredContents,
    refetch: refetchFeaturedContents,
    loading: loadingFeaturedContents,
  } = useQuery<GetFeaturedContentsQuery>(GET_FEATURED_CONTENTS_QUERY, {
    variables: { locale: i18n.language?.toUpperCase() },
  });
  const handleMoreClick = (): void => {
    fetchMore({
      variables: {
        after: contents?.contents.pageInfo.endCursor,
      },
    });
  };
  useEffect(() => {
    refetchContents({ locale: i18n.language?.toUpperCase() });
    refetchFeaturedContents({ locale: i18n.language?.toUpperCase() });
  }, [i18n.language, refetchContents, refetchFeaturedContents]);

  const DisplayContentCard = ({
    content,
    featured,
  }: {
    content: Content | FeaturedContent;
    featured?: boolean;
  }) => (
    <ContentCard
      content={content}
      onPress={() =>
        navigation.navigate("Videos.Detail", {
          slug: content.slug,
          hlsUrl: content.hlsUrl,
        })
      }
      featured={featured}
    />
  );

  return (
    <ScrollView style={styles.scrollView}>
      {loadingContents || loadingFeaturedContents ? (
        <View style={styles.activityIndicatorView}>
          <ActivityIndicator color={theme.colors.primary} />
        </View>
      ) : (
        <>
          {featuredContents?.contents?.nodes &&
            featuredContents.contents.nodes.length > 0 &&
            compact(featuredContents.contents.nodes).map((content) => (
              <DisplayContentCard key={content.id} content={content} featured />
            ))}
          {contents?.contents?.edges &&
            compact(contents.contents.edges).length > 0 && (
              <>
                {compact(contents.contents.edges).map(
                  ({ node: content }) =>
                    content && (
                      <DisplayContentCard key={content.id} content={content} />
                    ),
                )}
                {contents.contents.pageInfo.hasNextPage && (
                  <Button onPress={handleMoreClick}>{t("Load More")}</Button>
                )}
              </>
            )}
        </>
      )}
    </ScrollView>
  );
};

export default ListScreen;
