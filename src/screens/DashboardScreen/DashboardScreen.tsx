import React, { ReactElement } from "react";
import { gql, useQuery } from "@apollo/client";
import Background from "../../components/Background";
import Logo from "../../components/Logo";
import Header from "../../components/Header";
import Paragraph from "../../components/Paragraph";
import Button from "../../components/Button";
import firebaseClient from "../../core/firebaseClient";
import { MeQuery } from "../../../types/MeQuery";
import apolloClient from "../../core/apolloClient";

const ME_QUERY = gql`
  query MeQuery {
    me {
      id
      givenName
      familyName
      nickname
      locale
      email
      emailVerified
    }
  }
`;

const DashboardScreen = (): ReactElement => {
  const { data } = useQuery<MeQuery>(ME_QUERY);

  const handleLogoutPressed = async (): Promise<void> => {
    await apolloClient.resetStore();
    await firebaseClient.auth().signOut();
  };

  return (
    <Background>
      <Logo />
      <Header>Fetching Your Profile</Header>
      <Paragraph>{data?.me.id}</Paragraph>
      <Button mode="outlined" onPress={handleLogoutPressed}>
        Logout
      </Button>
    </Background>
  );
};

export default DashboardScreen;
