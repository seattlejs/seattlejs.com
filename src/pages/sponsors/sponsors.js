import { h, Component } from "preact";
import { canUseDOM } from "exenv";
import classnames from "classnames";
import styles from './sponsors.css';
import sponsors from "../../../data/sponsors";
import Sponsor from "../../components/sponsor/sponsor.js";
import BasePage from "../../components/base-page";
import CTA from "../../components/cta";

const SponsorPage = () => (
  <BasePage className={styles.sponsors}>
    <div className={styles.skyline}>
      <h1>Our shining sponsors</h1>
    </div>

    <CTA id="cta-sponsor">
      <h2>{"Interested in Sponsoring?"}</h2>
      <i className="material-icons">arrow_forward</i>
      <a className="btn" href="https://github.com/FormidableLabs/seattle.js-prospectus/files/980039/SeattleJS.2017.Prospectus.pdf">Get Prospectus</a>
      <h2>or</h2>
      <a className="btn" href="mailto:conference@seattlejs.com">Contact Us</a>
    </CTA>
    {
      !!sponsors.presenting.length &&
      <section className={styles.sponsorContainer}>
        <h1 className={styles.headline}>Presenting Sponsor</h1>
        { sponsors.presenting.map((sponsor, i) => (
          <Sponsor className={styles.presenting} {...sponsor} />
        ))}
      </section>
    }
    {
      !!sponsors.diamond.length &&
      <section className={styles.sponsorContainer}>
        <h1 className={styles.headline}>Diamond Sponsors</h1>
        { sponsors.diamond.map((sponsor, i) => (
          <Sponsor className={styles.diamond} {...sponsor} />
        ))}
      </section>
    }
    {
      !!sponsors.platinum.length &&
      <section className={styles.sponsorContainer}>
        <h1 className={styles.headline}>Platinum Sponsors</h1>
        { sponsors.platinum.map((sponsor, i) => (
          <Sponsor className={styles.platinum} {...sponsor} />
        ))}
      </section>
    }
    {
      !!sponsors.gold.length &&
      <section className={classnames(styles.sponsorContainer)}>
        <h1 className={styles.headline}>Gold Sponsors</h1>
        { sponsors.gold.map((sponsor, i) => <Sponsor className={styles.gold} {...sponsor} />) }
      </section>
    }
    {
      !!sponsors.silver.length &&
      <section className={classnames(styles.sponsorContainer)}>
        <h1 className={styles.headline}>Silver Sponsors</h1>
        { sponsors.silver.map((sponsor, i) => <Sponsor className={styles.silver} {...sponsor} />) }
      </section>
    }
    {
      !!sponsors.community.length &&
      <section className={classnames(styles.sponsorContainer)}>
        <h1 className={styles.headline}>Community Sponsors</h1>
        { sponsors.community.map((sponsor, i) => <Sponsor className={styles.community} {...sponsor} />) }
      </section>
    }
  </BasePage>
);

export default SponsorPage;
