/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: ContentLikeToggleMutation
// ====================================================

export interface ContentLikeToggleMutation_contentLikeToggle_like_content {
  __typename: "Arclight";
  id: string;
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

export interface ContentLikeToggleMutation_contentLikeToggle_like {
  __typename: "Like";
  content: ContentLikeToggleMutation_contentLikeToggle_like_content;
}

export interface ContentLikeToggleMutation_contentLikeToggle {
  __typename: "ContentLikeToggleMutationPayload";
  like: ContentLikeToggleMutation_contentLikeToggle_like;
}

export interface ContentLikeToggleMutation {
  contentLikeToggle: ContentLikeToggleMutation_contentLikeToggle | null;
}

export interface ContentLikeToggleMutationVariables {
  id: string;
}
