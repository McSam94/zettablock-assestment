import { REDO_ACTION_TYPE, UNDO_ACTION_TYPE } from "@stores/reducers/data";
import { IData, IQuery } from "@typing/data";
import { createRequestTypes } from "@utils/request";

export const UPDATE_QUERY = "UPDATE_QUERY";
export const updateQuery = (query: IQuery) => ({
  type: UPDATE_QUERY,
  payload: { query },
});

export const GET_DATA_LIST = createRequestTypes("GET_DATA_LIST");
export const getDataList = (query: IQuery) => ({
  type: GET_DATA_LIST.REQUEST,
  payload: { query },
});

export const GET_DATA = createRequestTypes("GET_DATA");
export const getData = (id: string) => ({
  type: GET_DATA.REQUEST,
  payload: { id },
});

export const UPDATE_DATA = createRequestTypes("UPDATE_DATA");
export const updateData = (id: string, data: IData) => ({
  type: UPDATE_DATA.REQUEST,
  payload: {
    id,
    data,
  },
});
export const resetUpdateData = () => ({
  type: UPDATE_DATA.RESET,
});

export const DELETE_DATA = createRequestTypes("DELETE_DATA");
export const deleteData = (id: string) => ({
  type: DELETE_DATA.REQUEST,
  payload: {
    id,
  },
});
export const resetDeleteData = () => ({
  type: DELETE_DATA.RESET,
});

export const UPDATE_ACTIVE_TAB = "UPDATE_ACTIVE_TAB";
export const updateActiveTab = (index: number) => ({
  type: UPDATE_ACTIVE_TAB,
  payload: { index },
});

export const CREATE_NEW_TAB = "CREATE_NEW_TAB";
export const createNewTab = () => ({
  type: CREATE_NEW_TAB,
});

export const DELETE_TAB = "DELETE_TAB";
export const deleteTab = (index: number) => ({
  type: DELETE_TAB,
  payload: {
    index,
  },
});

export const UNDO_ACTION = createRequestTypes("UNDO_ACTION");
export const undo = (data: IData, action: UNDO_ACTION_TYPE) => ({
  type: UNDO_ACTION.REQUEST,
  payload: {
    data,
    action,
  },
});
export const resetUndo = () => ({
  type: UNDO_ACTION.RESET,
});

export const REDO_ACTION = createRequestTypes("REDO_ACTION");
export const redo = (data: IData, action: REDO_ACTION_TYPE) => ({
  type: REDO_ACTION.REQUEST,
  payload: {
    data,
    action,
  },
});
export const resetRedo = () => ({
  type: REDO_ACTION.RESET,
});
