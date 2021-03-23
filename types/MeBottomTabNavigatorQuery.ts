/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: MeBottomTabNavigatorQuery
// ====================================================

export interface MeBottomTabNavigatorQuery_me {
  __typename: "Me";
  id: string;
  admin: boolean;
}

export interface MeBottomTabNavigatorQuery {
  /**
   * Current User
   */
  me: MeBottomTabNavigatorQuery_me;
}
