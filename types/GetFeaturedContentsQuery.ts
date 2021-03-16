/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { LocaleEnum } from "./globalTypes";

// ====================================================
// GraphQL query operation: GetFeaturedContentsQuery
// ====================================================

export interface GetFeaturedContentsQuery_contents_nodes {
  __typename: "Arclight";
  id: string;
  name: string;
  slug: string;
  description: string | null;
  hlsUrl: string;
  pictureLargeUrl: string;
}

export interface GetFeaturedContentsQuery_contents {
  __typename: "ContentInterfaceConnection";
  /**
   * A list of nodes.
   */
  nodes: (GetFeaturedContentsQuery_contents_nodes | null)[] | null;
}

export interface GetFeaturedContentsQuery {
  /**
   * List of contents
   */
  contents: GetFeaturedContentsQuery_contents;
}

export interface GetFeaturedContentsQueryVariables {
  locale?: LocaleEnum | null;
}
