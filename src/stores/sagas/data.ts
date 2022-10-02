import { put, call, takeLatest, StrictEffect } from "redux-saga/effects";
import DataService from "@services/data";
import { GET_DATA_LIST } from "@stores/actions/data";
import { IDatas } from "@typing/data";
import { AxiosResponse } from "axios";

function* getDataList(): Generator<StrictEffect, void, AxiosResponse<IDatas>> {
  try {
    const result = yield call(DataService.GetDataList);

    if (result.status === 200) {
      yield put({
        type: GET_DATA_LIST.SUCCESS,
        payload: {
          data: result.data,
        },
      });
    } else {
      yield put({
        type: GET_DATA_LIST.FAIL,
        payload: {
          error: result.statusText,
        },
      });
    }
  } catch (error: any) {
    yield put({
      type: GET_DATA_LIST.FAIL,
      payload: {
        error: error.message,
      },
    });
  }
}

const dataSaga = function* () {
  yield takeLatest(GET_DATA_LIST.REQUEST, getDataList);
};

export default dataSaga;
