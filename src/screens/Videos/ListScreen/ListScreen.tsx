import React, { ReactElement, useEffect } from "react";
import { gql, useQuery } from "@apollo/client";
import { ScrollView, StyleSheet } from "react-native";
import { compact } from "lodash";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import ContentCard from "../../../components/ContentCard";
import { GetContentsQuery } from "../../../../types/GetContentsQuery";
import { GetFeaturedContentsQuery } from "../../../../types/GetFeaturedContentsQuery";
import Button from "../../../components/Button";

export const GET_FEATURED_CONTENTS_QUERY = gql`
  query GetFeaturedContentsQuery($locale: LocaleEnum) {
    contents(locale: $locale, featured: true) {
      nodes {
        id
        name
        slug
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
    padding: 10,
  },
});

const ListScreen = (): ReactElement => {
  const { t, i18n } = useTranslation();
  const navigation = useNavigation();
  const {
    data: contents,
    fetchMore,
    refetch: refetchContents,
  } = useQuery<GetContentsQuery>(GET_CONTENTS_QUERY, {
    variables: { locale: i18n.language?.toUpperCase() },
  });
  const {
    data: featuredContents,
    refetch: refetchFeaturedContents,
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

  return (
    <ScrollView style={styles.scrollView}>
      {featuredContents?.contents?.nodes &&
        featuredContents.contents.nodes.length > 0 &&
        compact(featuredContents.contents.nodes).map((content) => (
          <ContentCard
            key={content.id}
            content={content}
            onPress={() =>
              navigation.navigate("Videos.Detail", {
                slug: content.slug,
                hlsUrl: content.hlsUrl,
              })
            }
          />
        ))}
      {contents?.contents?.edges &&
        compact(contents.contents.edges).length > 0 && (
          <>
            {compact(contents.contents.edges).map(
              ({ node: content }) =>
                content && (
                  <ContentCard
                    key={content.id}
                    content={content}
                    onPress={() =>
                      navigation.navigate("Videos.Detail", {
                        slug: content.slug,
                        hlsUrl: content.hlsUrl,
                      })
                    }
                  />
                ),
            )}
            {contents.contents.pageInfo.hasNextPage && (
              <Button onPress={handleMoreClick}>{t("Load More")}</Button>
            )}
          </>
        )}
    </ScrollView>
  );
};

export default ListScreen;
