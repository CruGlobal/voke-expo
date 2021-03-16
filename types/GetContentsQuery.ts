/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { LocaleEnum } from "./globalTypes";

// ====================================================
// GraphQL query operation: GetContentsQuery
// ====================================================

export interface GetContentsQuery_contents_edges_node {
  __typename: "Arclight";
  id: string;
  name: string;
  slug: string;
  description: string | null;
  hlsUrl: string;
  pictureLargeUrl: string;
}

export interface GetContentsQuery_contents_edges {
  __typename: "ContentInterfaceEdge";
  /**
   * The item at the end of the edge.
   */
  node: GetContentsQuery_contents_edges_node | null;
}

export interface GetContentsQuery_contents_pageInfo {
  __typename: "PageInfo";
  /**
   * When paginating forwards, the cursor to continue.
   */
  endCursor: string | null;
  /**
   * When paginating forwards, are there more items?
   */
  hasNextPage: boolean;
}

export interface GetContentsQuery_contents {
  __typename: "ContentInterfaceConnection";
  /**
   * A list of edges.
   */
  edges: (GetContentsQuery_contents_edges | null)[] | null;
  /**
   * Information to aid in pagination.
   */
  pageInfo: GetContentsQuery_contents_pageInfo;
}

export interface GetContentsQuery {
  /**
   * List of contents
   */
  contents: GetContentsQuery_contents;
}

export interface GetContentsQueryVariables {
  after?: string | null;
  locale?: LocaleEnum | null;
}
