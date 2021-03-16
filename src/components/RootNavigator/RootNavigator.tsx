import { createStackNavigator } from "@react-navigation/stack";
import React, { ReactElement, useEffect } from "react";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { Dimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Appbar from "../Appbar";
import { Auth } from "../../core/firebaseClient";
import Accounts from "../../screens/Accounts";
import Notifications from "../../screens/Notifications";
import BottomNavigation from "../BottomNavigation";
import DrawerContent from "../DrawerContent";
import Videos from "../../screens/Videos";

const Stack = createStackNavigator();

const StackNavigator = (): ReactElement => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

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
      headerMode="screen"
      screenOptions={{
        header: (props) => <Appbar {...props} />,
      }}
    >
      <Stack.Screen name="Dashboard" component={BottomNavigation} />
      <Stack.Screen name="Profile" component={Accounts.ProfileScreen} />
      <Stack.Screen name="Notifications" component={Notifications.ListScreen} />
      <Stack.Screen
        name="Welcome"
        component={Accounts.WelcomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="Login" component={Accounts.LoginScreen} />
      <Stack.Screen
        name="Register"
        component={Accounts.RegisterScreen}
        options={{ title: "Sign Up" }}
      />
      <Stack.Screen
        name="ForgotPassword"
        component={Accounts.ForgotPasswordScreen}
        options={{ title: "Forgot My Password" }}
      />
      <Stack.Screen
        name="Videos.Detail"
        component={Videos.DetailScreen}
        options={{
          headerShown: false,
          gestureDirection: "vertical",
          gestureResponseDistance: {
            vertical: Dimensions.get("window").width / (16 / 9) + insets.top,
          },
          cardStyleInterpolator: ({ current, layouts }) => {
            return {
              cardStyle: {
                transform: [
                  {
                    translateY: current.progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [layouts.screen.height, 0],
                    }),
                  },
                ],
              },
            };
          },
        }}
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
