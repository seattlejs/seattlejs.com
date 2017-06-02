import { h, Component } from 'preact';
import styles from './styles.css';
import Router from 'preact-router';
import Footer from "./components/footer";
import DesktopNav from "./components/nav/desktop-nav";
import MobileNav from "./components/nav/mobile-nav";
import HomePage from './pages/home';
import SponsorPage from './pages/sponsors/sponsors';
import SpeakerPage from './pages/speakers/speakers';

export const App = () => (
    <main>
      <MobileNav />
      <DesktopNav />

      <Router>
        <HomePage path="/home" default />
        <SponsorPage path="/sponsors" />
        <SpeakerPage path="/speakers" />
      </Router>

      <Footer />
    </main>
);

export default App;
