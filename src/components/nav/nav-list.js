import { h } from "preact";
import styles from "./nav.css";

// shared nav links for mobile and desktop components
const NavList = ({ onClick }) => (
  <ul className={styles.navList}>
    <a href="home" onClick={onClick} >Home</a>
    <a href="home#sponsor" onClick={onClick}>Sponsor or Host</a>
    <a href="home#speak" onClick={onClick} >Speak</a>
    <a href="home#about" onClick={onClick} >About</a>
    <a href="https://twitter.com/seattlejs" target='_blank' rel='noreferrer'>Twitter</a>
    <a href="https://t.co/OXLIuxXvER?amp=1" target='_blank' rel='noreferrer'>Slack</a>
    <a href="https://www.youtube.com/channel/UCcSA-OGuAesfDqFNdEYGTaQ" target='_blank' rel='noreferrer'>Youtube</a>
  </ul>
);

export default NavList;
