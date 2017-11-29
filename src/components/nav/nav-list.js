import { h } from "preact";
import styles from "./nav.css";

// shared nav links for mobile and desktop components
const NavList = ({onClick}) => (
  <ul className={styles.navList}>
    <a href="home" onClick={onClick} >Home</a>
    <a href="home#sponsor" onClick={onClick}>Sponsor or Host</a>
    <a href="home#speak" onClick={onClick} >Speak</a>
    <a href="home#about" onClick={onClick} >About</a>
  </ul>
);

export default NavList;
