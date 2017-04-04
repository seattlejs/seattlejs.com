import { createStore, applyMiddleware, compose, combineReducers } from "redux";
import { routerForBrowser, initializeCurrentLocation } from 'redux-little-router';
import createSagaMiddleware from "redux-saga";
import reducers from "./reducers";
import rootSaga from "../sagas";
import routes from './routes';

const reduxDevTools = window.devToolsExtension || (() => noop => noop);

export const configureStore = (initialState = {}) => {
  const {
    reducer: routerReducer,
    enhancer: routerEnhancer,
    middleware: routerMiddleware,
  } = routerForBrowser({ routes });

  const sagaMiddleware = createSagaMiddleware();

  const middlewares = [
    sagaMiddleware,
    routerMiddleware,
  ];

  const enhancers = [
    routerEnhancer,
    applyMiddleware(...middlewares),
    reduxDevTools(),
  ];

  const store = createStore(
    combineReducers({
      ...reducers,
      router: routerReducer,
    }),
    initialState,
    compose(...enhancers)
  );

  sagaMiddleware.run(rootSaga);

  const state = store.getState();
  if (state && state.router) {
    store.dispatch(initializeCurrentLocation(state.router));
  }

  return store;
};
