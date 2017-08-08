import { h, Component } from "preact";
import classnames from "classnames";
import homestyles from '../../styles.css';
import styles from "./schedule.css";
import CTA from "../../components/cta";

class SchedulePage extends Component {

  render() {
    return (
      <div className={styles.schedule}>
        <div className={styles.skyline}>
          <h1 className={styles.headline}>Schedule</h1>
        </div>
        <div>
          <CTA id="cta-sponsor">
            <h2 className={homestyles.ctaText}>{"Download the Schedule App"}</h2>
            <i className="material-icons">arrow_forward</i>
            <a className="btn" href="https://itunes.apple.com/us/app/seattlejs/id1266855314?ls=1&mt=8">Apple</a>
            <h2>or</h2>
            <a className="btn" href="https://play.google.com/store/apps/details?id=com.kenwheeler.seattlejs">Android</a>
          </CTA>
        </div>
        <div>
          <iframe src="https://calendar.google.com/calendar/embed?mode=AGENDA&amp;height=600&amp;wkst=1&amp;bgcolor=%23FFFFFF&amp;src=formidable.com_vpmm8qabdevi4kg80lfktkskv0%40group.calendar.google.com&amp;color=%23125A12&amp;ctz=America%2FLos_Angeles" style="border-width:0" width="800" height="600" frameborder="0" scrolling="no"></iframe>
        </div>
      </div>
    )
  }
};

export default SchedulePage;
