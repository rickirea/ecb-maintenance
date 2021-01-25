import React, { useRef, useState } from "react";
import { CardContainer } from "./styles";
import { useDrop } from "react-dnd";
import { useItemDrag } from "./useItemDrag";
import { CardDragItem } from "./DragItem";
import { useAppState, Car } from "./AppStateContext";
import { isHidden } from "./utils/isHidden";
import { ChangeItemForm } from "./ChangeItemForm";

interface CardProps {
  text: string;
  index: number;
  id: number;
  columnId: number;
  isPreview?: boolean;
  car: Car;
}

export const Card = ({
  car,
  text,
  id,
  index,
  columnId,
  isPreview,
}: CardProps) => {
  const { state, dispatch } = useAppState();
  const ref = useRef<HTMLDivElement>(null);
  const [, drop] = useDrop({
    accept: "CARD",
    hover(item: CardDragItem) {
      if (item.id === id) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      const sourceColumn = item.columnId;
      const targetColumn = columnId;
      dispatch({
        type: "MOVE_CAR",
        payload: { dragIndex, hoverIndex, sourceColumn, targetColumn },
      });
      item.index = hoverIndex;
      item.columnId = targetColumn;
    },
  });

  const { drag } = useItemDrag({ type: "CARD", id, index, text, columnId });

  drag(drop(ref));

  const onAdd = (text: string) => {
    //console.log("Text:", text);
    const dragIndex = index;
    const hoverIndex = 0;
    const sourceColumn = 0;
    const targetColumn = 1;
    const estimatedDate = text;

    if (text !== undefined && text !== "") {
      dispatch({
        type: "UPDATE_CAR",
        payload: {
          dragIndex,
          hoverIndex,
          sourceColumn,
          targetColumn,
          estimatedDate,
        },
      });
    }
  };

  return (
    <CardContainer
      isPreview={isPreview}
      ref={ref}
      isHidden={isHidden(isPreview, state.draggedItem, "CARD", id)}
    >
      {car.description ? (
        <div>
          <div>
            <img
              src={car.image || "images/car.png"}
              alt={car.make}
              width="100%"
            />
          </div>
          <div>{`(${car.id}) ${car.make} ${car.model}`}</div>
          <div>{`km: ${car.km}`}</div>
          <div>{`desc: ${car.description}`}</div>
          <div>{`Estimated date: ${car.estimatedate}`}</div>

          <br />
          {!car.estimatedate && (
            <ChangeItemForm
              onAdd={(text) => {
                onAdd(text);
              }}
            />
          )}
        </div>
      ) : (
        text
      )}
    </CardContainer>
  );
};
