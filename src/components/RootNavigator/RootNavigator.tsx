import { createStackNavigator } from "@react-navigation/stack";
import React, { ReactElement, useEffect } from "react";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Appbar from "../Appbar";
import { Auth } from "../../core/firebaseClient";
import Accounts from "../../screens/Accounts";
import BottomNavigation from "../BottomNavigation";
import DrawerContent from "../DrawerContent";

const Stack = createStackNavigator();

const StackNavigator = (): ReactElement => {
  const navigation = useNavigation();

  useEffect(() => {
    return Auth.onAuthStateChanged((user) => {
      if (user && user.displayName) {
        navigation.reset({
          index: 0,
          routes: [{ name: "Dashboard" }],
        });
      } else if (user) {
        navigation.reset({
          index: 0,
          routes: [{ name: "Profile" }],
        });
      } else {
        navigation.reset({
          index: 0,
          routes: [{ name: "Welcome" }],
        });
      }
    });
  }, [navigation]);

  return (
    <Stack.Navigator
      initialRouteName="Welcome"
      screenOptions={{
        header: (props) => <Appbar {...props} />,
      }}
    >
      <Stack.Screen name="Dashboard" component={BottomNavigation} />
      <Stack.Screen name="Profile" component={Accounts.ProfileScreen} />
      <Stack.Screen
        name="Welcome"
        component={Accounts.WelcomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="Login" component={Accounts.LoginScreen} />
      <Stack.Screen name="Register" component={Accounts.RegisterScreen} />
      <Stack.Screen
        name="ForgotPassword"
        component={Accounts.ForgotPasswordScreen}
      />
    </Stack.Navigator>
  );
};

const Drawer = createDrawerNavigator();

const RootNavigator = (): ReactElement => {
  return (
    <NavigationContainer>
      <Drawer.Navigator drawerContent={(props) => <DrawerContent {...props} />}>
        <Drawer.Screen name="Home" component={StackNavigator} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
