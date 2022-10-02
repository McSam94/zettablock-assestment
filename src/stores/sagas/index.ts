import { all, call, cancel, fork, spawn, take } from "redux-saga/effects";
import dataSaga from "./data";

const rootSaga = function* () {
  const sagas = [dataSaga];

  yield all(
    sagas.map((saga) =>
      spawn(function* () {
        while (true) {
          try {
            yield call(saga);
            break;
          } catch (e: any) {
            throw new Error(e);
          }
        }
      })
    )
  );
};

export default rootSaga;
