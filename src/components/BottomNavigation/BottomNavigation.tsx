import React, { ReactElement } from "react";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { MaterialIcons } from "@expo/vector-icons";
import { gql, useQuery } from "@apollo/client";
import Chats from "../../screens/Chats";
import StorybookScreen from "../../screens/StorybookScreen";
import theme from "../../core/theme";
import { MeBottomTabNavigatorQuery } from "../../../types/MeBottomTabNavigatorQuery";
import Adventures from "../../screens/Adventures";
import Videos from "../../screens/Videos";

const BottomTab = createMaterialBottomTabNavigator();

const ME_BOTTOM_TAB_NAVIGATOR_QUERY = gql`
  query MeBottomTabNavigatorQuery {
    me {
      id
      admin
    }
  }
`;

const BottomTabNavigator = (): ReactElement => {
  const { data } = useQuery<MeBottomTabNavigatorQuery>(
    ME_BOTTOM_TAB_NAVIGATOR_QUERY,
  );
  return (
    <BottomTab.Navigator barStyle={{ backgroundColor: theme.colors.primary }}>
      <BottomTab.Screen
        name="Community"
        component={Chats.ListScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="home" color={color} size={26} />
          ),
        }}
      />
      <BottomTab.Screen
        name="Adventures"
        component={Adventures.ListScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="explore" color={color} size={26} />
          ),
        }}
      />
      <BottomTab.Screen
        name="Videos"
        component={Videos.ListScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="video-library" color={color} size={26} />
          ),
        }}
      />
      {data?.me.admin && (
        <BottomTab.Screen
          name="Storybook"
          component={StorybookScreen}
          options={{
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="book" color={color} size={26} />
            ),
          }}
        />
      )}
    </BottomTab.Navigator>
  );
};

export default BottomTabNavigator;
