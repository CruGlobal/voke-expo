import { createStackNavigator } from "@react-navigation/stack";
import React, { ReactElement, useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import HomeScreen from "../../screens/HomeScreen";
import LoginScreen from "../../screens/LoginScreen";
import RegisterScreen from "../../screens/RegisterScreen";
import ForgotPasswordScreen from "../../screens/ForgotPasswordScreen";
import DashboardScreen from "../../screens/DashboardScreen";
import Appbar from "../Appbar";
import firebaseClient from "../../core/firebaseClient";

const Stack = createStackNavigator();

const Navigation = (): ReactElement => {
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    return firebaseClient.auth().onIdTokenChanged((user) => {
      setIsSignedIn(!!user);
    });
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          header: (props) => <Appbar {...props} />,
        }}
      >
        {isSignedIn ? (
          <>
            <Stack.Screen name="Home" component={DashboardScreen} />
          </>
        ) : (
          <>
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen
              name="ForgotPassword"
              component={ForgotPasswordScreen}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
