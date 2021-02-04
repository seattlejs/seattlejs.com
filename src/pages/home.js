import cs from 'classnames';
import { h } from 'preact';
import styles from '../styles.css';

// Images
import heroImgUrl from 'images/blank-seattlejs-header.png';
import pikePlaceUrl from 'images/pike-place.jpg';
import reactTrainingUrl from 'images/react-training.jpg';

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
      <h1>Seattle's Largest JavaScript Meet Up</h1>
    </Tagline>

    <CTA id="cta-meetup">
      <h2 className={styles.ctaText}>{"View Our meetup.com Page"}</h2>
      <i className="material-icons">arrow_forward</i>
      <a className="btn" href="https://www.meetup.com/seattlejs/" target='_blank' rel='noreferrer'>Upcoming Events</a>
    </CTA>
    <CTA id="cta-slack">
      <h2 className={styles.ctaText}>{"Join the Conversation on Slack"}</h2>
      <i className="material-icons">arrow_forward</i>
      <a className="btn" href="https://t.co/OXLIuxXvER?amp=1" target='_blank' rel='noreferrer'>Invite Link</a>
    </CTA>
    <CTA id="cta-youtube">
      <h2 className={styles.ctaText}>{"Watch our past talks on Youtube"}</h2>
      <i className="material-icons">arrow_forward</i>
      <a className="btn" href="https://www.youtube.com/channel/UCcSA-OGuAesfDqFNdEYGTaQ" target='_blank' rel='noreferrer'>Our Channel</a>
    </CTA>
    <CTA id="cta-sponsor">
      <h2 className={styles.ctaText}>{"Sponsor or Host a SeattleJS Meet Up"}</h2>
      <i className="material-icons">arrow_forward</i>
      <a className="btn" href="https://github.com/seattlejs/seattlejs/blob/master/sponsor-guidelines.md">Sponsor</a>
      <h2>or</h2>
      <a className="btn" href="https://github.com/seattlejs/seattlejs/blob/master/hosting-guidelines.md">Host</a>
    </CTA>

    <Copy id="sponsor">
      <div className={styles.copyText}>
        <h3>Sponsor or Host a SeattleJS Meet Up</h3>
        <p>Sponsoring and/or hosting a SeattleJS meet up is a great way to recruit excellent JavaScript talent and give back to the development community.</p>
        <p>Hosting involves providing a space for a monthly meet up, held the second Thursday of the month, while sponsoring involves paying for food and beverages for attendees. Many of our hosts also choose to sponsor, but it's certainly not required! We welcome any and all contributions to the running of our group.</p>
      </div>
      <div className={styles.copyImg}>
        <img src={pikePlaceUrl} />
      </div>
    </Copy>

    <CTA id="cta-speak">
      <h2 className={styles.ctaText}>{"Speak at a SeattleJS Meet Up"}</h2>
      <i className="material-icons">arrow_forward</i>
      <a className="btn" href="https://github.com/seattlejs/seattlejs/blob/master/request-to-speak.md">Submit a Talk</a>
    </CTA>

    <Copy id="speak">
      <div className={styles.copyImg}>
        <img src={reactTrainingUrl} />
      </div>
      <div className={styles.copyText}>
        <h3>Speak at SeattleJS</h3>
        <p>Come and speak at one of our meet ups! We're always looking for 15 minute lightning talks and 25 minute feature-length talks for our monthly programs.</p>
        <p>Speaking at SeattleJS is a great way to get your name out there, give back to the community, or practice a talk before submitting it to a conference. We're happy to help potential speakers prepare their talks and give tips for making their talk the best it can be.</p>
      </div>
    </Copy>

    <Copy id="about">
      <div className={styles.copyText}>
        <h3>About SeattleJS</h3>
        <p>SeattleJS is the largest JavaScript meet up in Seattle. We hold our meet ups on the second Thursday of every month at a variety of locations around Seattle.</p>
        <p>SeattleJS exisits to inform, inspire, and encourage members of the JavaScript community. Our goal is for you to leave inspired and ready to innovate.</p>
      </div>
    </Copy>
  </div>
);

export default HomePage;
