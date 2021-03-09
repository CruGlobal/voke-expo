/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: MeQuery
// ====================================================

export interface MeQuery_me {
  __typename: "Me";
  id: string;
  givenName: string | null;
  familyName: string | null;
  nickname: string | null;
  locale: string | null;
  email: string | null;
  emailVerified: boolean | null;
}

export interface MeQuery {
  /**
   * Current User
   */
  me: MeQuery_me;
}
