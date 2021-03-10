/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: MeAppbarQuery
// ====================================================

export interface MeAppbarQuery_me {
  __typename: "Me";
  id: string;
  picture: string | null;
}

export interface MeAppbarQuery {
  /**
   * Current User
   */
  me: MeAppbarQuery_me;
}
