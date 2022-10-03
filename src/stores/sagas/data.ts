import { put, call, takeLatest, StrictEffect } from "redux-saga/effects";
import DataService from "@services/data";
import {
  DELETE_DATA,
  GET_DATA,
  GET_DATA_LIST,
  REDO_ACTION,
  UNDO_ACTION,
  UPDATE_DATA,
} from "@stores/actions/data";
import { IData, IDatas, IQuery } from "@typing/data";
import { AxiosResponse } from "axios";
import { PayloadAction } from "@reduxjs/toolkit";
import { REDO_ACTION_TYPE, UNDO_ACTION_TYPE } from "@stores/reducers/data";

function* getDataList({
  payload,
}: PayloadAction<{ query: IQuery }>): Generator<
  StrictEffect,
  void,
  AxiosResponse<IDatas>
> {
  try {
    const result = yield call(DataService.GetDataList, payload.query);

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

function* getData({
  payload,
}: PayloadAction<{ id: string }>): Generator<
  StrictEffect,
  void,
  AxiosResponse<IData>
> {
  try {
    const result = yield call(DataService.GetData, payload.id);

    if (result.status === 200) {
      yield put({
        type: GET_DATA.SUCCESS,
        payload: {
          data: result.data,
        },
      });
    } else {
      yield put({
        type: GET_DATA.FAIL,
        payload: {
          error: result.statusText,
        },
      });
    }
  } catch (error: any) {
    yield put({
      type: GET_DATA.FAIL,
      payload: {
        error: error.message,
      },
    });
  }
}

function* updateData({
  payload: { id, data },
}: PayloadAction<{ id: string; data: IData }>): Generator<
  StrictEffect,
  void,
  AxiosResponse<IDatas>
> {
  try {
    const result = yield call(DataService.UpdateData, id, data);

    if (result.status === 200) {
      yield put({
        type: UPDATE_DATA.SUCCESS,
        payload: {
          id,
          data: result.data,
        },
      });
    } else {
      yield put({
        type: UPDATE_DATA.FAIL,
        payload: {
          error: result.statusText,
        },
      });
    }
  } catch (error: any) {
    yield put({
      type: UPDATE_DATA.FAIL,
      payload: {
        error: error.message,
      },
    });
  }
}

function* deleteData({
  payload,
}: PayloadAction<{ id: string }>): Generator<
  StrictEffect,
  void,
  AxiosResponse<IData>
> {
  try {
    const result = yield call(DataService.DeleteData, payload.id);

    if (result.status === 200) {
      yield put({
        type: DELETE_DATA.SUCCESS,
        payload: {
          data: result.data,
        },
      });
    } else {
      yield put({
        type: DELETE_DATA.FAIL,
        payload: {
          error: result.statusText,
        },
      });
    }
  } catch (error: any) {
    yield put({
      type: DELETE_DATA.FAIL,
      payload: {
        error: error.message,
      },
    });
  }
}

function* undo({
  payload,
}: PayloadAction<{ action: UNDO_ACTION_TYPE; data: IData }>): Generator<
  StrictEffect,
  void,
  AxiosResponse<IData>
> {
  try {
    const result =
      payload.action === "DELETE"
        ? yield call(DataService.createData, payload.data)
        : yield call(DataService.UpdateData, payload.data.id, payload.data);

    if (result.status === 200) {
      yield put({
        type: UNDO_ACTION.SUCCESS,
        payload: {
          data: result.data,
        },
      });
    } else {
      yield put({
        type: UNDO_ACTION.FAIL,
        payload: {
          error: result.statusText,
        },
      });
    }
  } catch (error: any) {
    yield put({
      type: DELETE_DATA.FAIL,
      payload: {
        error: error.message,
      },
    });
  }
}

function* redo({
  payload,
}: PayloadAction<{ action: REDO_ACTION_TYPE; data: IData }>): Generator<
  StrictEffect,
  void,
  AxiosResponse<IData>
> {
  try {
    const result =
      payload.action === "CREATE"
        ? yield call(DataService.DeleteData, payload.data.id)
        : yield call(DataService.UpdateData, payload.data.id, payload.data);

    if (result.status === 200) {
      yield put({
        type: UNDO_ACTION.SUCCESS,
        payload: {
          data: result.data,
        },
      });
    } else {
      yield put({
        type: UNDO_ACTION.FAIL,
        payload: {
          error: result.statusText,
        },
      });
    }
  } catch (error: any) {
    yield put({
      type: DELETE_DATA.FAIL,
      payload: {
        error: error.message,
      },
    });
  }
}

const dataSaga = function* () {
  yield takeLatest(GET_DATA_LIST.REQUEST, getDataList);
  yield takeLatest(GET_DATA.REQUEST, getData);
  yield takeLatest(UPDATE_DATA.REQUEST, updateData);
  yield takeLatest(DELETE_DATA.REQUEST, deleteData);
  yield takeLatest(UNDO_ACTION.REQUEST, undo);
  yield takeLatest(REDO_ACTION.REQUEST, redo);
};

export default dataSaga;
