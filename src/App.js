import React from 'react';
import cs from 'classnames';
import heroImgUrl from 'images/seattlejs-hero.png';
import pikePlaceUrl from 'images/pike-place.jpg';
import locationImgUrl from 'images/fremont-foundry.jpg';
import styles from './styles.css';
import formidableLogoSvg from 'images/formidable-logo.svg';

const Container = ({ tagName="section", children, className, wrapperClassName, ...restProps }) => (
  React.createElement(tagName, { ...restProps, className: cs(styles.container, wrapperClassName) },
    React.createElement('div', { className }, children)
  )
);

const Tagline = (props) => <Container wrapperClassName={styles.tagline} {...props}/>
const Copy    = (props) => <Container className={styles.copy} {...props } />
const CTA     = (props) => <Container className={styles.cta} {...props } />
const Footer  = (props) => <Container tagName="footer" className={styles.innerFooter} {...props } />

class DesktopNav extends React.Component {
  render() {
    return (
      <div className={styles.desktopNavContainer}>
        <nav className={styles.desktopNav}>
          <div className={styles.navList}>
            <a href="#about">About</a>
            <a href="#location">Location</a>
            <a href="https://www.papercall.io/sjs">Call for Proposals</a>
          </div>
          <div className={styles.navCtaButton}>
            <a href="https://seattlejs2017.eventbrite.com" className="btn">Register</a>
          </div>
        </nav>
      </div>
    );
  }
}

class MobileNav extends React.Component {
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

  render() {
    const { open } = this.state;
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
              <a href="#about" onClick={this.toggle}>About</a>
              <a href="#location" onClick={this.toggle}>Location</a>
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

    <section id="hero" className={styles.hero}>
      <img src={heroImgUrl}></img>
    </section>

    <Tagline>
      <h1>The Pacific Northwest's Conference for All Things JavaScript</h1>
    </Tagline>

    <Container
      wrapperClassName={styles.formidableBanner_outer}
      className={styles.formidableBanner}>
      <div className={styles.sponsoredBy}>Presenting Sponsor</div>
      <div
        className={styles.svgContainer}
        dangerouslySetInnerHTML={{ __html: formidableLogoSvg }}
      />
    </Container>

    <CTA id="cta-proposals">
      <h2 className={styles.ctaText}>{"The call for proposals is now open!"}</h2>
      <i className="material-icons">arrow_forward</i>
      <a className="btn" href="https://www.papercall.io/sjs">Submit a Talk</a>
    </CTA>

    <Copy id="about">
      <div className={styles.copyText}>
        <h3>Introducing SeattleJS Conference</h3>
        <p>SeattleJS Conference is a two day conference covering the depth and breadth of JavaScript. Put on by one of the largest JavaScript user groups in the country, SeattleJS Conference is a convergence of the top talent in JavaScript from the Pacific Northwest and beyond. SeattleJS Conference is located in the heart of the Fremont neighborhood at the distinctive Fremont Foundry.</p>
        <p>SeattleJS exisits to inform, inspire, and encourage members of the JavaScript community. Our goal is for you to leave inspired and ready to innovate.</p>
      </div>
      <div className={styles.copyImg}>
        <img src={pikePlaceUrl} />
      </div>
    </Copy>

    <CTA id="cta-sponsor">
      <h2 className={styles.ctaText}>{"Interested in Sponsoring?"}</h2>
      <i className="material-icons">arrow_forward</i>
      <a className="btn" href="mailto:conference@seattlejs.com">Contact Us</a>
    </CTA>

    <Copy id="location">
      <div className={styles.copyImg}>
        <img src={locationImgUrl} />
      </div>
      <div className={styles.copyText}>
        <h3>The Details</h3>
        <h4>When: August 10 - 11. 2017, with training days August 8-9)</h4>
        <p></p>
        <h4>Where: Fremont Foundry</h4>
        <p>SeattleJS's inaugural annual conference will be located at the beautiful and unique Fremont Foundry, located at 154 North 35th Street, Seattle, WA 98103.</p>
      </div>
    </Copy>

    <CTA id="cta-register">
      <h2 className={styles.ctaText}>{"Limited Early Bird Tickets Available"}</h2>
      <i className="material-icons">arrow_forward</i>
      <a className="btn" href="https://seattlejs2017.eventbrite.com">Buy Now</a>
    </CTA>

    <Copy id="training">
      <div className={styles.copyText}>
        <h3>Pre-Conference Training</h3>
        <p>Expand your SeattleJS conference experience with two days of training in advanced <a href="https://facebook.github.io/react/">React</a> and <a href="https://facebook.github.io/react-native/">React Native</a>. Taught by foremost experts in the field, the two days of training will level up your expertise in modern React and prepare you to build production-ready web and mobile applications.</p>
        <p>These exclusive trainings, hosted by <a href="http://formidable.com">Formidable</a>, are limited to a small group of conference attendees on Tuesday and Wednesday, August 8th and 9th. <a href="https://seattlejs2017.eventbrite.com">Register</a> early to ensure your participation.</p>
      </div>
      <div className={styles.copyImg}>
        <img src={pikePlaceUrl} />
      </div>
    </Copy>

    <Footer>
      <div className={styles.navList}>
        <a href="https://github.com/seattlejs/seattlejs/blob/master/code-of-conduct.md">Code of Conduct</a>
        <a href="https://twitter.com/seattlejs">Twitter</a>
      </div>
      <div className={styles.navContactUs}>
        <a href="mailto:conference@seattlejs.com">conference@seattlejs.com</a>
      </div>
    </Footer>
  </main>
);

export default App;
