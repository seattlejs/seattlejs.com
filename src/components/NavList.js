import React from 'react';
import cs from 'classnames';

export const NavLink = (props) => (
  <NavItem><a {...props} /></NavItem>
);

export const NavItem = ({ children }) => (
  <li>{ children }</li>
);

const NavList = ({ children }) => (
  <nav>
    <ul>
      { children }
    </ul>
  </nav>
);

export default NavList;
