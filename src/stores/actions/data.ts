import { createRequestTypes } from "@utils/request";

export const GET_DATA_LIST = createRequestTypes("GET_DATA_LIST");
export const getDataList = () => ({
  type: GET_DATA_LIST.REQUEST,
});
