import {
  CREATE_NEW_TAB,
  DELETE_DATA,
  DELETE_TAB,
  GET_DATA,
  GET_DATA_LIST,
  REDO_ACTION,
  UNDO_ACTION,
  UPDATE_ACTIVE_TAB,
  UPDATE_DATA,
  UPDATE_QUERY,
} from "@stores/actions/data";
import { IData, IDatas, IQuery } from "@typing/data";
import { ActionType } from "@typing/reducer";

const initialQueryState = {
  page: 1,
  limit: 10,
  sortBy: null,
  order: null,
};

export type UNDO_ACTION_TYPE = "UPDATE" | "DELETE";

export type REDO_ACTION_TYPE = "CREATE" | "UPDATE";

interface DataState {
  isGettingData: boolean;
  hasGotData: boolean;
  data: Record<number, IDatas> | null;
  possibleHasMore: boolean;
  getDataError: string;
  isUpdatingData: boolean;
  hasUpdatedData: boolean;
  updateDataError: string;
  isDeletingData: boolean;
  hasDeletedData: boolean;
  deleteDataError: string;
  isGettingDataDetail: boolean;
  hasGotDataDetail: boolean;
  dataDetail: IData | null;
  getDataDetailError: string;
  isUndoing: boolean;
  undoData: IData | null;
  undoAction: UNDO_ACTION_TYPE | null;
  hasSuccessUndo: boolean;
  isRedoing: boolean;
  redoData: IData | null;
  redoAction: REDO_ACTION_TYPE | null;
  hasSuccessRedo: boolean;
  activeTab: number;
  tabsQuery: Array<IQuery>;
  createTabError: string;
  deleteTabError: string;
}

const initialState: DataState = {
  isGettingData: false,
  hasGotData: false,
  data: null,
  possibleHasMore: true,
  getDataError: "",

  isUpdatingData: false,
  hasUpdatedData: false,
  updateDataError: "",

  isDeletingData: false,
  hasDeletedData: false,
  deleteDataError: "",

  isGettingDataDetail: false,
  hasGotDataDetail: false,
  dataDetail: null,
  getDataDetailError: "",

  isUndoing: false,
  undoData: null,
  undoAction: null,
  hasSuccessUndo: false,

  isRedoing: false,
  redoData: null,
  redoAction: null,
  hasSuccessRedo: false,

  activeTab: 0,

  tabsQuery: [initialQueryState],
  createTabError: "",
  deleteTabError: "",
};

const dataReducer = (state = initialState, action: ActionType): DataState => {
  switch (action.type) {
    case UPDATE_QUERY: {
      return {
        ...state,
        tabsQuery: Object.assign([], state.tabsQuery, {
          [state.activeTab]: action.payload.query,
        }),
      };
    }
    case GET_DATA_LIST.REQUEST: {
      return {
        ...state,
        isGettingData: true,
      };
    }
    case GET_DATA_LIST.SUCCESS: {
      const data = action.payload.data;
      const currentQuery = state.tabsQuery[state.activeTab];

      return {
        ...state,
        isGettingData: false,
        hasGotData: true,
        data: {
          ...(state.data ?? {}),
          [currentQuery.page]: data,
        },
        possibleHasMore: data.length < currentQuery.page,
      };
    }
    case GET_DATA_LIST.FAIL: {
      return {
        ...state,
        isGettingData: false,
        hasGotData: false,
        getDataError: action.payload.error,
      };
    }
    case GET_DATA.REQUEST: {
      return {
        ...state,
        isGettingDataDetail: true,
      };
    }
    case GET_DATA.SUCCESS: {
      return {
        ...state,
        isGettingDataDetail: false,
        hasGotDataDetail: true,
        dataDetail: action.payload.data,
      };
    }
    case GET_DATA.FAIL: {
      return {
        ...state,
        isGettingDataDetail: false,
        hasGotDataDetail: false,
        getDataDetailError: action.payload.error,
      };
    }
    case UPDATE_DATA.REQUEST: {
      return {
        ...state,
        isUpdatingData: true,
      };
    }
    case UPDATE_DATA.SUCCESS: {
      const currentQuery = state.tabsQuery[state.activeTab];
      const currentPageData = state.data?.[currentQuery.page];
      const updateDataIndex = currentPageData?.findIndex(
        (data) => data.id === action.payload.id
      );

      return {
        ...state,
        isUpdatingData: false,
        hasUpdatedData: true,
        undoData:
          typeof updateDataIndex !== "undefined" && updateDataIndex >= 0
            ? currentPageData?.[updateDataIndex] ?? null
            : null,
        undoAction: "UPDATE",
        data: {
          ...state.data,
          [currentQuery.page]:
            typeof updateDataIndex !== "undefined" && updateDataIndex > -1
              ? Object.assign([], currentPageData, {
                  [updateDataIndex]: action.payload.data,
                })
              : [],
        },
      };
    }
    case UPDATE_DATA.FAIL: {
      return {
        ...state,
        isUpdatingData: false,
        hasUpdatedData: false,
        updateDataError: action.payload.error,
      };
    }
    case UPDATE_DATA.RESET: {
      return {
        ...state,
        hasUpdatedData: false,
        updateDataError: "",
      };
    }
    case DELETE_DATA.REQUEST: {
      return {
        ...state,
        isDeletingData: true,
      };
    }
    case DELETE_DATA.SUCCESS: {
      return {
        ...state,
        isDeletingData: false,
        hasDeletedData: true,
        undoData: action.payload.data,
        undoAction: "DELETE",
      };
    }
    case DELETE_DATA.FAIL: {
      return {
        ...state,
        isDeletingData: false,
        hasDeletedData: false,
        deleteDataError: action.payload.error,
      };
    }
    case DELETE_DATA.RESET: {
      return {
        ...state,
        hasDeletedData: false,
        deleteDataError: "",
      };
    }
    case UPDATE_ACTIVE_TAB: {
      return {
        ...state,
        activeTab: action.payload.index,
      };
    }
    case CREATE_NEW_TAB: {
      return {
        ...state,
        tabsQuery: state.data
          ? [...state.tabsQuery, initialQueryState]
          : state.tabsQuery,
        createTabError: state.data ? "" : "Data not initialized yet.",
      };
    }
    case DELETE_TAB: {
      const newTabsQuery = state.tabsQuery.filter(
        (_, idx) => idx !== action.payload.index
      );

      return {
        ...state,
        tabsQuery: [...newTabsQuery],
        activeTab: newTabsQuery.length - 1,
      };
    }
    case UNDO_ACTION.REQUEST: {
      const previousDatas = state.data
        ? Object.values(state.data).reduce(
            (accData, data) => [...accData, ...data],
            []
          )
        : null;
      const redoData = previousDatas?.find(
        (data) => data.id === action.payload.data.id
      );

      return {
        ...state,
        isUndoing: true,
        redoAction: action.payload.action === "DELETE" ? "CREATE" : "UPDATE",
        redoData: redoData ?? null,
      };
    }
    case UNDO_ACTION.SUCCESS: {
      return {
        ...state,
        isUndoing: false,
        hasSuccessUndo: true,
        undoAction: null,
        undoData: null,
        redoData:
          state.redoAction === "CREATE" ? action.payload.data : state.redoData,
      };
    }
    case UNDO_ACTION.FAIL: {
      return {
        ...state,
        isUndoing: false,
        hasSuccessUndo: false,
        undoAction: null,
        undoData: null,
      };
    }
    case UNDO_ACTION.RESET: {
      return {
        ...state,
        isUndoing: false,
        hasSuccessUndo: false,
        undoAction: null,
        undoData: null,
      };
    }
    case REDO_ACTION.REQUEST: {
      return {
        ...state,
        isRedoing: true,
      };
    }
    case REDO_ACTION.SUCCESS: {
      return {
        ...state,
        isRedoing: false,
        redoAction: null,
        redoData: null,
      };
    }
    case REDO_ACTION.FAIL: {
      return {
        ...state,
        isRedoing: false,
        hasSuccessRedo: false,
        redoAction: null,
        redoData: null,
      };
    }
    case REDO_ACTION.RESET: {
      return {
        ...state,
        isRedoing: false,
        hasSuccessRedo: false,
        redoAction: null,
        redoData: null,
      };
    }
    default: {
      return state;
    }
  }
};

export default dataReducer;
