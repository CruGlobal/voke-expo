import React, { ReactElement, useEffect } from "react";
import Background from "../../components/Background";
import Logo from "../../components/Logo";
import Header from "../../components/Header";
import Button from "../../components/Button";
import Paragraph from "../../components/Paragraph";
import { Navigation } from "../../types";
import welcomeScreen from "../../assets/welcomeScreen.png";
import firebaseClient from "../../core/firebaseClient";

type Props = {
  navigation: Navigation;
};

const HomeScreen = ({ navigation }: Props): ReactElement => {
  useEffect(() => {
    return firebaseClient.auth().onIdTokenChanged((user) => {
      if (user) navigation.navigate("DashboardScreen");
    });
  }, [navigation]);

  const handleAnonymousPressed = (): void => {
    firebaseClient.auth().signInAnonymously();
  };

  return (
    <Background source={welcomeScreen} resizeMode="cover">
      <Logo />
      <Header>Welcome to Voke!</Header>
      <Paragraph style={{ color: "#fff", fontWeight: "bold" }}>
        We&apos;re engaging in video series exploring questions about faith and
        Jesus, together.
      </Paragraph>
      <Button
        mode="contained"
        onPress={() => navigation.navigate("LoginScreen")}
      >
        Login
      </Button>
      <Button
        mode="outlined"
        onPress={() => navigation.navigate("RegisterScreen")}
      >
        Sign Up
      </Button>
      <Button mode="outlined" onPress={handleAnonymousPressed}>
        I&apos;d like to Explore
      </Button>
      <Paragraph style={{ color: "#fff", fontSize: 14 }}>
        By exploring you agree to our Privacy Policy and Terms of Service.
      </Paragraph>
    </Background>
  );
};

export default HomeScreen;
