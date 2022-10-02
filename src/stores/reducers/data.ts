import { GET_DATA_LIST } from "@stores/actions/data";
import { IDatas } from "@typing/data";
import { ActionType } from "@typing/reducer";

interface DataState {
  isGettingData: boolean;
  hasGotData: boolean;
  data: IDatas | null;
  getDataError: string;
}

const initialState: DataState = {
  isGettingData: false,
  hasGotData: false,
  data: null,
  getDataError: "",
};

const dataReducer = (state = initialState, action: ActionType): DataState => {
  switch (action.type) {
    case GET_DATA_LIST.REQUEST: {
      return {
        ...state,
        isGettingData: true,
      };
    }
    case GET_DATA_LIST.SUCCESS: {
      return {
        ...state,
        isGettingData: false,
        hasGotData: true,
        data: action.payload.data,
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
    default: {
      return state;
    }
  }
};

export default dataReducer;
