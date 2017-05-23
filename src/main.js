import { h, render } from 'preact';
import App from './App';

import 'static/CNAME';
import './core.css';

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

render(
  <App />,
  document.getElementById('root')
);
