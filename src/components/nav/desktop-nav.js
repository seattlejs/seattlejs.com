import { h } from "preact";
import NavList from "./nav-list";
import styles from "./nav.css";

const DesktopNav = () => (
  <div className={styles.desktopNavContainer}>
    <nav className={styles.desktopNav}>
      <NavList />
      <div className={styles.navCtaButton}>
        <a href="https://seattlejs2017.eventbrite.com" className="btn">Register</a>
      </div>
    </nav>
  </div>
);

export default DesktopNav;
