import { createStackNavigator } from "@react-navigation/stack";
import React, { ReactElement, useEffect, useRef } from "react";
import {
  NavigationContainer,
  NavigationContainerRef,
} from "@react-navigation/native";
import Appbar from "../Appbar";
import { Auth } from "../../core/firebaseClient";
import Accounts from "../../screens/Accounts";
import BottomNavigation from "../BottomNavigation";

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
        <Stack.Screen name="Dashboard" component={BottomNavigation} />
        <Stack.Screen name="Profile" component={Accounts.ProfileScreen} />
        <Stack.Screen
          name="Home"
          component={Accounts.HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Login" component={Accounts.LoginScreen} />
        <Stack.Screen name="Register" component={Accounts.RegisterScreen} />
        <Stack.Screen
          name="ForgotPassword"
          component={Accounts.ForgotPasswordScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
