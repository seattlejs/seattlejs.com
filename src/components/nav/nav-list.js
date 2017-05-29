import { h } from "preact";
import styles from "./nav.css";

// shared nav links for mobile and desktop components
const NavList = () => (
  <ul className={styles.navList}>
    <a href="home">Home</a>
    <a href="home#location">Location</a>
    <a href="/sponsors">Sponsors</a>
    <a href="https://www.papercall.io/sjs">Call for Proposals</a>
  </ul>
);

export default NavList;
