/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: ContentDislikeToggleMutation
// ====================================================

export interface ContentDislikeToggleMutation_contentDislikeToggle_dislike_content {
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

export interface ContentDislikeToggleMutation_contentDislikeToggle_dislike {
  __typename: "Dislike";
  content: ContentDislikeToggleMutation_contentDislikeToggle_dislike_content;
}

export interface ContentDislikeToggleMutation_contentDislikeToggle {
  __typename: "ContentDislikeToggleMutationPayload";
  dislike: ContentDislikeToggleMutation_contentDislikeToggle_dislike;
}

export interface ContentDislikeToggleMutation {
  contentDislikeToggle: ContentDislikeToggleMutation_contentDislikeToggle | null;
}

export interface ContentDislikeToggleMutationVariables {
  id: string;
}
