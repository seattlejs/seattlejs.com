import React from 'react';
import cs from 'classnames';
import NavList, { NavLink } from 'components/NavList';
import heroImgUrl from 'images/seattlejs-hero.png';

export const App = () => (
  <main>
    <NavList>
      <NavLink href="#about">About</NavLink>
      <NavLink href="#cta-proposals">Call for Proposals</NavLink>
      <NavLink href="#" className="btn">Register</NavLink>
    </NavList>

    <section id="hero">
      <img className="hero-image" src={heroImgUrl}></img>
    </section>

    <section id="cta-proposals" className="cta">
      <h3>Our CFP is open!</h3>
      <a className="btn-large" href="#">Submit a Talk <i className="material-icons right">send</i></a>
    </section>

    <section id="about" className="copy">
      <p>Voluptatum impedit ut. Dolore asperiores in quia veritatis. Nihil odit reiciendis similique et quia. Omnis ut voluptatem consectetur veritatis. Dolorum ab ut doloremque rerum saepe ratione reiciendis amet sit. Consequatur ipsum itaque et. Nam doloribus vel sed consequuntur assumenda ut voluptate. A voluptatum non aperiam dicta cupiditate impedit.
      Voluptatum impedit ut. Dolore asperiores in quia veritatis. Nihil odit reiciendis similique et quia. Omnis ut voluptatem consectetur veritatis. Dolorum ab ut doloremque rerum saepe ratione reiciendis amet sit. Consequatur ipsum itaque et. Nam doloribus vel sed consequuntur assumenda ut voluptate. A voluptatum non aperiam dicta cupiditate impedit.
      Voluptatum impedit ut. Dolore asperiores in quia veritatis. Nihil odit reiciendis similique et quia. Omnis ut voluptatem consectetur veritatis. Dolorum ab ut doloremque rerum saepe ratione reiciendis amet sit. Consequatur ipsum itaque et. Nam doloribus vel sed consequuntur assumenda ut voluptate. A voluptatum non aperiam dicta cupiditate impedit.</p>
    </section>

    <section id="cta-sponsor" className="cta">
      <h3>Want to sponsor?</h3>
      <a className="btn-large" href="#">Contact us<i className="material-icons right">send</i></a>
    </section>

    <section id="location" className="copy">
      <p>Voluptatum impedit ut. Dolore asperiores in quia veritatis. Nihil odit reiciendis similique et quia. Omnis ut voluptatem consectetur veritatis. Dolorum ab ut doloremque rerum saepe ratione reiciendis amet sit. Consequatur ipsum itaque et. Nam doloribus vel sed consequuntur assumenda ut voluptate. A voluptatum non aperiam dicta cupiditate impedit.
      Voluptatum impedit ut. Dolore asperiores in quia veritatis. Nihil odit reiciendis similique et quia. Omnis ut voluptatem consectetur veritatis. Dolorum ab ut doloremque rerum saepe ratione reiciendis amet sit. Consequatur ipsum itaque et. Nam doloribus vel sed consequuntur assumenda ut voluptate. A voluptatum non aperiam dicta cupiditate impedit.
      Voluptatum impedit ut. Dolore asperiores in quia veritatis. Nihil odit reiciendis similique et quia. Omnis ut voluptatem consectetur veritatis. Dolorum ab ut doloremque rerum saepe ratione reiciendis amet sit. Consequatur ipsum itaque et. Nam doloribus vel sed consequuntur assumenda ut voluptate. A voluptatum non aperiam dicta cupiditate impedit.</p>
    </section>

    <section id="cta-register" className="cta">
      <h3>Early Bird Registration</h3>
      <a className="btn-large" href="#">Buy<i className="material-icons right">send</i></a>
    </section>

    <footer>
      ceci n'est pas un footer
    </footer>
  </main>
);

export default App;
