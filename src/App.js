import { h, Component } from 'preact';
import styles from './styles.css';
import Router from 'preact-router';
import Footer from "./components/footer";

import HomePage from './pages/home';
import SponsorPage from './pages/sponsors/sponsors';

const DesktopNav = () => (
  <div className={styles.desktopNavContainer}>
    <nav className={styles.desktopNav}>
      <div className={styles.navList}>
        <a href="/">Home</a>
        <a href="home#about">About</a>
        <a href="home#location">Location</a>
        <a href="/sponsors">Sponsors</a>
        <a href="https://www.papercall.io/sjs">Call for Proposals</a>
      </div>
      <div className={styles.navCtaButton}>
        <a href="https://seattlejs2017.eventbrite.com" className="btn">Register</a>
      </div>
    </nav>
  </div>
);

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
            <div className={styles.navList}>
              <a href="/" onClick={this.toggle}>Home</a>
              <a href="home#about" onClick={this.toggle}>About</a>
              <a href="home#location" onClick={this.toggle}>Location</a>
              <a href="/sponsors" onClick={this.toggle}>Sponsors</a>
              <a href="https://www.papercall.io/sjs" onClick={this.toggle}>Call for Proposals</a>
            </div>
          }
        </nav>
      </div>
    );
  }
}

export const App = () => (
    <main>
      <MobileNav />
      <DesktopNav />

      <Router>
        <HomePage path="/home" default />
        <SponsorPage path="/sponsors" />
      </Router>

      <Footer />
    </main>

);

export default App;
