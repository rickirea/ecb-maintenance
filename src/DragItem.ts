export type ColumnDragItem = {
  index: number;
  id: number;
  text: string;
  type: "COLUMN";
};

export type CardDragItem = {
  index: number;
  id: number;
  columnId: number;
  text: string;
  type: "CARD";
};

export type DragItem = CardDragItem | ColumnDragItem;
