import React, { ReactElement } from "react";
import { Paragraph } from "react-native-paper";
import Background from "../../../components/Background";

const ListScreen = (): ReactElement => {
  return (
    <Background>
      <Paragraph>Chats</Paragraph>
    </Background>
  );
};

export default ListScreen;
