import React, { ReactElement, useEffect } from "react";
import Background from "../../components/Background";
import Logo from "../../components/Logo";
import Header from "../../components/Header";
import Paragraph from "../../components/Paragraph";
import Button from "../../components/Button";
import { Navigation } from "../../types";
import firebaseClient from "../../core/firebaseClient";

type Props = {
  navigation: Navigation;
};

const Dashboard = ({ navigation }: Props): ReactElement => {
  useEffect(() => {
    return firebaseClient.auth().onIdTokenChanged((user) => {
      if (!user) navigation.navigate("HomeScreen");
    });
  }, [navigation]);

  const handleLogoutPressed = (): void => {
    firebaseClient.auth().signOut();
  };

  return (
    <Background>
      <Logo />
      <Header>Let’s start</Header>
      <Paragraph>
        Your amazing app starts here. Open you favourite code editor and start
        editing this project.
      </Paragraph>
      <Button mode="outlined" onPress={handleLogoutPressed}>
        Logout
      </Button>
    </Background>
  );
};

export default Dashboard;
