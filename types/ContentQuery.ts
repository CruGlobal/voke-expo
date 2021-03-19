/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: ContentQuery
// ====================================================

export interface ContentQuery_content {
  __typename: "Arclight";
  id: string;
  name: string;
  slug: string;
  description: string | null;
  viewsCount: number;
  likesCount: number;
  /**
   * authenticated users likes content
   */
  like: boolean;
  dislikesCount: number;
  /**
   * authenticated users dislikes content
   */
  dislike: boolean;
}

export interface ContentQuery {
  /**
   * Find content by ID or slug
   */
  content: ContentQuery_content;
}

export interface ContentQueryVariables {
  id: string;
}
