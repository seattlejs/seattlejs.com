import { call, takeLatest } from 'redux-saga/effects';

const SAGA_FOR_ROUTE = {
  '/': function* () {
    console.log("Hello, root!");
  }
};

function* navigationSaga(action) {
  const location = action.payload;
  const saga = SAGA_FOR_ROUTE[location.route];
  if (saga) {
    yield call(saga, location);
  }
}

export default function* () {
  yield takeLatest("ROUTER_LOCATION_CHANGED", navigationSaga);
}
