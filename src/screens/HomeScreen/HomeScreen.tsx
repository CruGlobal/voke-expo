import React, { ReactElement } from "react";
import { useNavigation } from "@react-navigation/native";
import Background from "../../components/Background";
import Logo from "../../components/Logo";
import Header from "../../components/Header";
import Button from "../../components/Button";
import Paragraph from "../../components/Paragraph";
import welcomeScreen from "../../assets/welcomeScreen.png";
import { Auth } from "../../core/firebaseClient";

const HomeScreen = (): ReactElement => {
  const navigation = useNavigation();

  const handleAnonymousPressed = (): void => {
    Auth.signInAnonymously();
  };

  return (
    <Background source={welcomeScreen} resizeMode="cover">
      <Logo />
      <Header>Welcome to Voke!</Header>
      <Paragraph style={{ color: "#fff", fontWeight: "bold" }}>
        We&apos;re engaging in video series exploring questions about faith and
        Jesus, together.
      </Paragraph>
      <Button mode="contained" onPress={() => navigation.navigate("Login")}>
        Login
      </Button>
      <Button mode="outlined" onPress={() => navigation.navigate("Register")}>
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
