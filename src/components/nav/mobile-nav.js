import { h, Component } from "preact";
import NavList from "./nav-list";
import styles from "./nav.css";

class MobileNav extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false
    };
    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState({ open: !this.state.open });
  }

  render(props, { open }) {
    return (
      <div className={styles.mobileNavContainer}>
        <nav className={styles.mobileNav}>
          <button className={styles.hamburgerButton} onClick={this.toggle}>
            <i className="material-icons">{ open ? "close" : "menu" }</i>
          </button>
          <div className={styles.navCtaButton}>
            <a href="https://seattlejs2017.eventbrite.com" className="btn">Register</a>
          </div>
            { open &&
            <NavList onClick={this.toggle} />
          }
        </nav>
      </div>
    );
  }
};

export default MobileNav;
