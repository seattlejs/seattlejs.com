import cs from 'classnames';
import { h } from 'preact';
import styles from '../styles.css';

// Images
import heroImgUrl from 'images/seattlejs-hero.png';
import pikePlaceUrl from 'images/pike-place.jpg';
import locationImgUrl from 'images/fremont-foundry.jpg';
import reactTrainingUrl from 'images/react-training.jpg';
import scholarshipUrl from 'images/scholarship.jpg';
import formidableLogoSvg from 'images/formidable-logo.svg';

// Components
import Tagline from "../components/tagline";
import Copy from "../components/copy";
import CTA from "../components/cta";
import Container from "../components/container";

const HomePage = () => (
  <div>
    <section id="hero" className={styles.hero}>
      <div>
        <img src={heroImgUrl}></img>
      </div>
    </section>

    <Tagline>
      <h1>The Pacific Northwest's Conference for All Things JavaScript</h1>
    </Tagline>

    <Container
      wrapperClassName={styles.formidableBanner_outer}
      className={styles.formidableBanner}>
      <div className={styles.sponsoredBy}>Presenting Sponsor</div>
      <a
        className={styles.svgContainer}
        href="https://formidable.com"
        dangerouslySetInnerHTML={{ __html: formidableLogoSvg }}
      />
    </Container>

    <CTA id="cta-register">
      <h2 className={styles.ctaText}>{"SeattleJS Conference is sold out."}</h2>
    </CTA>

    <Copy id="about">
      <div className={styles.copyText}>
        <h3>Introducing SeattleJS Conference</h3>
        <p>SeattleJS Conference is a two day, single track conference covering the depth and breadth of JavaScript. Put on by one of the largest JavaScript user groups in the country, SeattleJS Conference is a convergence of the top talent in JavaScript from the Pacific Northwest and beyond. SeattleJS Conference is located in the heart of the Fremont neighborhood at the distinctive Fremont Foundry.</p>
        <p>SeattleJS exisits to inform, inspire, and encourage members of the JavaScript community. Our goal is for you to leave inspired and ready to innovate.</p>
      </div>
      <div className={styles.copyImg}>
        <img src={pikePlaceUrl} />
      </div>
    </Copy>

    <CTA id="cta-sponsor">
      <h2 className={styles.ctaText}>{"Download the Schedule App"}</h2>
      <i className="material-icons">arrow_forward</i>
      <a className="btn" href="https://itunes.apple.com/us/app/seattlejs/id1266855314?ls=1&mt=8">Apple</a>
      <h2>or</h2>
      <a className="btn" href="https://play.google.com/store/apps/details?id=com.kenwheeler.seattlejs">Android</a>
    </CTA>

    <Copy id="location">
      <div className={styles.copyImg}>
        <img src={locationImgUrl} />
      </div>
      <div className={styles.copyText}>
        <h3>The Details</h3>
        <h4>When: August 10 - 11. 2017, with training days August 8-9</h4>
        <h4>Where: Fremont Foundry</h4>
        <p>SeattleJS's inaugural annual conference will be located at the beautiful and unique Fremont Foundry, located at 154 North 35th Street, Seattle, WA 98103.</p>
      </div>
    </Copy>

    <Copy id="training">
      <div className={styles.copyText}>
        <h3>Pre-Conference Training</h3>
        <p>Expand your SeattleJS conference experience with two days of training in advanced <a href="https://facebook.github.io/react/">React</a> and <a href="https://facebook.github.io/react-native/">React Native</a>. Taught by foremost experts in the field, the two days of training will level up your expertise in modern React and prepare you to build production-ready web and mobile applications.</p>
        <p>These exclusive trainings, hosted by <a href="http://formidable.com">Formidable</a>, are limited to a small group of conference attendees on Tuesday and Wednesday, August 8th and 9th. This pre-event training is sold out.</p>
      </div>
      <div className={styles.copyImg}>
        <img src={reactTrainingUrl} />
      </div>
    </Copy>

    <Copy id="diversity">
      <div className={styles.copyImg}>
        <img src={scholarshipUrl} />
      </div>
      <div className={styles.copyText}>
        <h3>Diversity Scholarships</h3>
        <p>SeattleJS believes that inclusivity, diversity, and accessibility are vital to a thriving community. In order to ensure that SeattleJS Conference is accessible to groups who are underrepresented in technology, we’re pleased to offer diversity scholarships to our inaugural conference. The application deadline has closed and scholarships have been awarded.</p>
      </div>
    </Copy>
  </div>
);

export default HomePage;
