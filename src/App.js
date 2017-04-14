import React from 'react';
import cs from 'classnames';
import heroImgUrl from 'images/seattlejs-hero.png';
import pikePlaceUrl from 'images/pike-place.jpg';
import locationImgUrl from 'images/fremont-foundry.jpg';
import styles from './styles.css';

const Nav = (props) => <nav {...props} className={styles.container} />;
const NavLink = (props) => <NavItem><a {...props} /></NavItem>;
const NavItem = (props) => <li {...props}/>;
const NavList = (props) => <ul {...props}/>;
const Hero  = (props) => <section {...props} className={cs(styles.container, styles.hero)} />

const Footer = ({ children, ...restProps }) => (
  <footer {...restProps} className={styles.container}>
    <div className={styles.innerFooter}>
      { children }
    </div>
  </footer>
);

const Copy  = ({ children, ...restProps}) => (
  <section {...restProps} className={styles.container}>
    <div className={styles.copy}>
      { children }
    </div>
  </section>
);

const CTA   = ({ children, ...restProps }) => (
  <section {...restProps} className={styles.container}>
    <div className={styles.cta}>
      { children }
    </div>
  </section>
);

const Palette = () => (
  <div className={styles.palette}>
    <div className={styles.p1} />
    <div className={styles.p2} />
    <div className={styles.p3} />
    <div className={styles.p4} />
    <div className={styles.p5} />
    <div className={styles.p6} />
    <div className={styles.p7} />
  </div>
);

export const App = () => (
  <main>
    <Palette />
    <nav className={styles.container}>
      <div className={styles.navList}>
        <a href="#about">About</a>
        <a href="#location">Location</a>
        <a href="#cta-proposals">Call for Proposals</a>
      </div>
      <div className={styles.navCtaButton}>
        <a href="#" className="btn">Register</a>
      </div>
    </nav>

    <section id="hero">
      <img className={styles.heroImage} src={heroImgUrl}></img>
    </section>

    <CTA id="cta-proposals">
      <h2 className={styles.ctaText}>{"The call for proposals is now open!"}</h2>
      <i className="material-icons">arrow_forward</i>
      <a className="btn" href="#">Submit a Talk</a>
    </CTA>

    <Copy id="about">
      <div className={styles.copyText}>
        <h3>About the Seattle.js Conf</h3>
        <p>Voluptatum impedit ut. Dolore asperiores in quia veritatis. Nihil odit reiciendis similique et quia. Omnis ut voluptatem consectetur veritatis. Dolorum ab ut doloremque rerum saepe ratione reiciendis amet sit. Consequatur ipsum itaque et. Nam doloribus vel sed consequuntur assumenda ut voluptate. A voluptatum non aperiam dicta cupiditate impedit.</p>
        <p>Voluptatum impedit ut. Dolore asperiores in quia veritatis. Nihil odit reiciendis similique et quia. Omnis ut voluptatem consectetur veritatis. Dolorum ab ut doloremque rerum saepe ratione reiciendis amet sit. Consequatur ipsum itaque et. Nam doloribus vel sed consequuntur assumenda ut voluptate. A voluptatum non aperiam dicta cupiditate impedit.</p>
      </div>
      <div className={styles.copyImg}>
        <img src={pikePlaceUrl} />
      </div>
    </Copy>

    <CTA id="cta-sponsor">
      <h2 className={styles.ctaText}>{"Want to become a sponsor? (You're the best.)"}</h2>
      <i className="material-icons">arrow_forward</i>
      <a className="btn" href="#">Contact Us</a>
    </CTA>

    <Copy id="location">
      <div className={styles.copyImg}>
        <img src={locationImgUrl} />
      </div>
      <div className={styles.copyText}>
        <h3>The Details</h3>
        <h4>When: August 10-11. 2017</h4>
        <p>Voluptatum impedit ut. Dolore asperiores in quia veritatis. Nihil odit reiciendis similique et quia. Omnis ut voluptatem consectetur veritatis. Dolorum ab ut doloremque rerum saepe ratione reiciendis amet sit. Consequatur ipsum itaque et. Nam doloribus vel sed consequuntur assumenda ut voluptate. A voluptatum non aperiam dicta cupiditate impedit.</p>
        <h4>Where: Fremont Foundry</h4>
        <p>Voluptatum impedit ut. Dolore asperiores in quia veritatis. Nihil odit reiciendis similique et quia. Omnis ut voluptatem consectetur veritatis. Dolorum ab ut doloremque rerum saepe ratione reiciendis amet sit. Consequatur ipsum itaque et. Nam doloribus vel sed consequuntur assumenda ut voluptate. A voluptatum non aperiam dicta cupiditate impedit.</p>
      </div>
    </Copy>

    <CTA id="cta-register">
      <h2 className={styles.ctaText}>{"Can't wait? Early Bird Registration starts here"}</h2>
      <i className="material-icons">arrow_forward</i>
      <a className="btn" href="#">Buy Tickets</a>
    </CTA>

    <Footer>
      <div className={styles.navList}>
        <a href="#">Code of Conduct</a>
        <a href="#">Twitter</a>
      </div>
      <div className={styles.navContactUs}>
        <a href="#">us@seattlejs.org</a>
      </div>
    </Footer>
  </main>
);

export default App;
