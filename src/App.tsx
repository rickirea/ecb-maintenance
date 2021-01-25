import React from "react";
import { Column } from "./Column";
import { AppContainer } from "./styles";
import { useAppState } from "./AppStateContext";
import CustomDragLayer from "./CustomDragLayer";
import * as dotenv from "dotenv";

dotenv.config();

function App() {
  const { state, dispatch } = useAppState();

  return (
    <AppContainer>
      <CustomDragLayer />
      {state.lists.map((list, i) => (
        <Column id={list.id} text={list.text} key={list.id} index={i}></Column>
      ))}
    </AppContainer>
  );
}

export default App;
