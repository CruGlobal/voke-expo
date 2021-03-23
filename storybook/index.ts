import {
  getStorybookUI,
  configure,
  addDecorator,
} from "@storybook/react-native";
import { withKnobs } from "@storybook/addon-knobs";
import "./rn-addons";
import { loadStories } from "./storyLoader";

addDecorator(withKnobs);

configure(loadStories, module);

const StorybookUIRoot = getStorybookUI({ asyncStorage: null });

export default StorybookUIRoot;
