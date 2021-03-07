import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import HomeScreen from "../../screens/HomeScreen";
import LoginScreen from "../../screens/LoginScreen";
import RegisterScreen from "../../screens/RegisterScreen";
import ForgotPasswordScreen from "../../screens/ForgotPasswordScreen";
import DashboardScreen from "../../screens/DashboardScreen";

const Router = createStackNavigator(
  {
    HomeScreen,
    LoginScreen,
    RegisterScreen,
    ForgotPasswordScreen,
    DashboardScreen,
  },
  {
    initialRouteName: "HomeScreen",
    headerMode: "none",
  },
);

export default createAppContainer(Router);
