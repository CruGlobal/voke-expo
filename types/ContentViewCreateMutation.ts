/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: ContentViewCreateMutation
// ====================================================

export interface ContentViewCreateMutation_contentViewCreate_view_content {
  __typename: "Arclight";
  id: string;
  viewsCount: number;
}

export interface ContentViewCreateMutation_contentViewCreate_view {
  __typename: "View";
  content: ContentViewCreateMutation_contentViewCreate_view_content;
}

export interface ContentViewCreateMutation_contentViewCreate {
  __typename: "ContentViewCreateMutationPayload";
  view: ContentViewCreateMutation_contentViewCreate_view;
}

export interface ContentViewCreateMutation {
  contentViewCreate: ContentViewCreateMutation_contentViewCreate | null;
}

export interface ContentViewCreateMutationVariables {
  id: string;
}
