import React, { createContext, useReducer, useContext, useEffect } from "react";
import { nanoid } from "nanoid";
import {
  findItemIndexById,
  insertItemAtIndex,
  overrideItemAtIndex,
  removeItemAtIndex,
  moveItem,
} from "./utils/arrayUtils";
import { DragItem } from "./DragItem";
import { save } from "./api";
import { withData } from "./withData";

export interface Car {
  id: number;
  description: string;
  make: string;
  model: string;
  estimatedate: string;
  km: number;
  image: string;
}

export interface List {
  id: number;
  text: string;
  cars: Car[];
}

export interface AppState {
  lists: List[];
  draggedItem: DragItem | undefined;
}

type Action =
  | {
      type: "ADD_LIST";
      payload: {
        id: number;
        title: string;
      };
    }
  | {
      type: "ADD_CAR";
      payload: {
        id: number;
        description: string;
        make: string;
        model: string;
        estimatedate: string;
        km: number;
        image: string;
        listId: number;
      };
    }
  | {
      type: "MOVE_LIST";
      payload: {
        dragIndex: number;
        hoverIndex: number;
      };
    }
  | {
      type: "SET_DRAGGED_ITEM";
      payload: DragItem | undefined;
    }
  | {
      type: "MOVE_CAR";
      payload: {
        dragIndex: number;
        hoverIndex: number;
        sourceColumn: number;
        targetColumn: number;
      };
    }
  | {
      type: "UPDATE_CAR";
      payload: {
        dragIndex: number;
        hoverIndex: number;
        sourceColumn: number;
        targetColumn: number;
        estimatedDate: string;
      };
    };

interface AppStateContextProps {
  state: AppState;
  dispatch: React.Dispatch<Action>;
}

const AppStateContext = createContext<AppStateContextProps>(
  {} as AppStateContextProps
);

const appStateReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case "ADD_LIST": {
      return {
        ...state,
        lists: [
          ...state.lists,
          { id: action.payload.id, text: action.payload.title, cars: [] },
        ],
      };
    }
    case "ADD_CAR": {
      const targetListIndex = findItemIndexById(
        state.lists,
        action.payload.listId
      );

      const targetList = state.lists[targetListIndex];

      const updatedTargetList = {
        ...targetList,
        tasks: [
          ...targetList.cars,
          {
            id: nanoid(),
            description: action.payload.description,
            make: action.payload.make,
            model: action.payload.model,
            estimatedate: action.payload.estimatedate,
            km: action.payload.km,
            image: action.payload.image,
          },
        ],
      };

      return {
        ...state,
        lists: overrideItemAtIndex(
          state.lists,
          updatedTargetList,
          targetListIndex
        ),
      };
    }
    case "MOVE_LIST": {
      const { dragIndex, hoverIndex } = action.payload;
      return {
        ...state,
        lists: moveItem(state.lists, dragIndex, hoverIndex),
      };
    }
    case "MOVE_CAR": {
      //console.log("payload:", action.payload);
      const {
        dragIndex,
        hoverIndex,
        sourceColumn,
        targetColumn,
      } = action.payload;

      const sourceListIndex = findItemIndexById(state.lists, sourceColumn);

      const targetListIndex = findItemIndexById(state.lists, targetColumn);

      const sourceList = state.lists[sourceListIndex];
      const car = sourceList.cars[dragIndex];

      car.estimatedate = "";

      const updatedSourceList = {
        ...sourceList,
        cars: removeItemAtIndex(sourceList.cars, dragIndex),
      };

      const stateWithUpdatedSourceList = {
        ...state,
        lists: overrideItemAtIndex(
          state.lists,
          updatedSourceList,
          sourceListIndex
        ),
      };

      const targetList = stateWithUpdatedSourceList.lists[targetListIndex];

      const updatedTargetList = {
        ...targetList,
        cars: insertItemAtIndex(targetList.cars, car, hoverIndex),
      };

      return {
        ...stateWithUpdatedSourceList,
        lists: overrideItemAtIndex(
          stateWithUpdatedSourceList.lists,
          updatedTargetList,
          targetListIndex
        ),
      };
    }
    case "UPDATE_CAR": {
      //console.log("payload:", action.payload);
      const {
        dragIndex,
        hoverIndex,
        sourceColumn,
        targetColumn,
        estimatedDate,
      } = action.payload;

      const sourceListIndex = findItemIndexById(state.lists, sourceColumn);
      const targetListIndex = findItemIndexById(state.lists, targetColumn);

      const sourceList = state.lists[sourceListIndex];
      const car = sourceList.cars[dragIndex];

      car.estimatedate = estimatedDate;

      const updatedSourceList = {
        ...sourceList,
        cars: removeItemAtIndex(sourceList.cars, dragIndex),
      };

      const stateWithUpdatedSourceList = {
        ...state,
        lists: overrideItemAtIndex(
          state.lists,
          updatedSourceList,
          sourceListIndex
        ),
      };

      const targetList = stateWithUpdatedSourceList.lists[targetListIndex];

      const updatedTargetList = {
        ...targetList,
        cars: insertItemAtIndex(targetList.cars, car, hoverIndex),
      };

      return {
        ...stateWithUpdatedSourceList,
        lists: overrideItemAtIndex(
          stateWithUpdatedSourceList.lists,
          updatedTargetList,
          targetListIndex
        ),
      };
    }
    case "SET_DRAGGED_ITEM": {
      return { ...state, draggedItem: action.payload };
    }
    default: {
      return state;
    }
  }
};

export const AppStateProvider = withData(
  ({
    children,
    initialState,
  }: React.PropsWithChildren<{ initialState: AppState }>) => {
    const [state, dispatch] = useReducer(appStateReducer, initialState);

    useEffect(() => {
      save(state);
    }, [state]);

    return (
      <AppStateContext.Provider value={{ state, dispatch }}>
        {children}
      </AppStateContext.Provider>
    );
  }
);

export const useAppState = () => {
  return useContext(AppStateContext);
};
