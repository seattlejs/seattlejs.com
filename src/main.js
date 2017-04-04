import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { configureStore } from 'store';

const store = configureStore();

ReactDOM.render(
  <Provider store={store}>
    <h1>Hello, world!</h1>
  </Provider>,
  document.getElementById('root')
);
