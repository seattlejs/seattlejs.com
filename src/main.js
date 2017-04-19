import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import 'static/CNAME';
import 'core.css';
import 'styles/icons.css';

let scrollingUp = false;
let scrollY = window.scrollY;

// SHENANIGANS
window.onscroll = () => {
  const dsy = scrollY - window.scrollY;

  if (dsy >= 0 && scrollingUp) {
    document.documentElement.setAttribute("style", "background: rgb(54,97,115);");
    scrollingUp = false;
  }

  if (dsy < 0 && !scrollingUp) {
    document.documentElement.setAttribute("style", "background: rgb(85,130,113);");
    scrollingUp = true;
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
