import React, { useState } from "react";
import { NewItemFormContainer, NewItemButton, NewItemInput } from "./styles";

interface ChangeItemFormProps {
  onAdd(text: string): void;
}

export const ChangeItemForm = ({ onAdd }: ChangeItemFormProps) => {
  const [text, setText] = useState("");

  return (
    <NewItemFormContainer>
      <label>Estimated date:</label>
      <NewItemInput
        type="date"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <NewItemButton onClick={() => onAdd(text)}>Maintenance</NewItemButton>
    </NewItemFormContainer>
  );
};
