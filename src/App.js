import { h, Component } from 'preact';
import styles from './styles.css';
import Router from 'preact-router';
import Footer from "./components/footer";
import DesktopNav from "./components/nav/desktop-nav";
import MobileNav from "./components/nav/mobile-nav";
import HomePage from './pages/home';

export const App = () => (
    <main>
      <MobileNav />
      <DesktopNav />

      <Router>
        <HomePage path="/home" default />
      </Router>

      <Footer />
    </main>
);

export default App;
