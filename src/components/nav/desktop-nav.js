import { h } from "preact";
import NavList from "./nav-list";
import styles from "./nav.css";

const DesktopNav = () => (
  <div className={styles.desktopNavContainer}>
    <nav className={styles.desktopNav}>
      <NavList />
      <div className={styles.navCtaButton}>
        <a href="https://www.meetup.com/seattlejs/" className="btn">Upcoming Events</a>
      </div>
    </nav>
  </div>
);

export default DesktopNav;
