import { h } from "preact";
import styles from "./nav.css";

// shared nav links for mobile and desktop components
const NavList = ({onClick}) => (
  <ul className={styles.navList}>
    <a href="home" onClick={onClick} >Home</a>
    <a href="home#location" onClick={onClick}>Location</a>
    <a href="sponsors" onClick={onClick} >Sponsors</a>
    <a href="speakers" onClick={onClick} >Speakers</a>
    <a href="schedule" onClick={onClick} >Schedule</a>
  </ul>
);

export default NavList;
