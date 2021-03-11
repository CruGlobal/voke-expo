import { createStackNavigator } from "@react-navigation/stack";
import React, { ReactElement, useEffect, useRef, useState } from "react";
import {
  NavigationContainer,
  NavigationContainerRef,
} from "@react-navigation/native";
import HomeScreen from "../../screens/HomeScreen";
import LoginScreen from "../../screens/LoginScreen";
import RegisterScreen from "../../screens/RegisterScreen";
import ForgotPasswordScreen from "../../screens/ForgotPasswordScreen";
import DashboardScreen from "../../screens/DashboardScreen";
import Appbar from "../Appbar";
import { Auth } from "../../core/firebaseClient";
import ProfileScreen from "../../screens/ProfileScreen";

const Stack = createStackNavigator();

const Navigation = (): ReactElement => {
  const navigationRef = useRef<NavigationContainerRef | null>(null);

  useEffect(() => {
    return Auth.onAuthStateChanged((firebaseUser) => {
      if (firebaseUser && firebaseUser.displayName) {
        navigationRef.current?.resetRoot({
          index: 0,
          routes: [{ name: "Dashboard" }],
        });
      } else if (firebaseUser) {
        navigationRef.current?.resetRoot({
          index: 0,
          routes: [{ name: "Profile" }],
        });
      } else {
        navigationRef.current?.resetRoot({
          index: 0,
          routes: [{ name: "Home" }],
        });
      }
    });
  }, []);

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          header: (props) => <Appbar user={Auth.currentUser} {...props} />,
        }}
      >
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
