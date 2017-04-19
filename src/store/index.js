import { createStore, applyMiddleware, compose, combineReducers } from "redux";
import { routerForBrowser, initializeCurrentLocation } from 'redux-little-router';
import routes from './routes';

const reduxDevTools = window.devToolsExtension || (() => noop => noop);

export const configureStore = (initialState = {}) => {
  const {
    reducer: routerReducer,
    enhancer: routerEnhancer,
    middleware: routerMiddleware,
  } = routerForBrowser({ routes });

  const middlewares = [
    routerMiddleware,
  ];

  const enhancers = [
    routerEnhancer,
    applyMiddleware(...middlewares),
    reduxDevTools(),
  ];

  const store = createStore(
    combineReducers({
      router: routerReducer,
    }),
    initialState,
    compose(...enhancers)
  );

  const state = store.getState();
  if (state && state.router) {
    store.dispatch(initializeCurrentLocation(state.router));
  }

  return store;
};
