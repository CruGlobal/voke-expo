import { DefaultTheme } from "react-native-paper";

const theme = {
  ...DefaultTheme,
  roundness: 0,
  colors: {
    ...DefaultTheme.colors,
    primary: "#44C8E8",
    secondary: "#fa8232",
    error: "#f13a59",
  },
};

export default theme;
