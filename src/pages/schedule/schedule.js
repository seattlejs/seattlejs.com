import { h, Component } from "preact";
import classnames from "classnames";
import styles from "./schedule.css";

class SchedulePage extends Component {

  // constructor(props) {
  //   super(props);
  //
  //   this.state = {
  //     speakers,
  //     selectedSpeaker: speakers[0]
  //   };
  //
  //   this.selectSpeaker = this.selectSpeaker.bind(this);
  // }
  //
  // selectSpeaker(speaker) {
  //   this.setState({
  //     selectedSpeaker: speaker
  //   });
  // }

  render() {
    return (
      <div className={styles.schedule}>
        <div className={styles.skyline}>
          <h1 className={styles.headline}>Schedule</h1>
        </div>
        <div>
          <iframe src="https://calendar.google.com/calendar/embed?mode=AGENDA&amp;height=600&amp;wkst=1&amp;bgcolor=%23FFFFFF&amp;src=formidable.com_vpmm8qabdevi4kg80lfktkskv0%40group.calendar.google.com&amp;color=%23125A12&amp;ctz=America%2FLos_Angeles" style="border-width:0" width="800" height="600" frameborder="0" scrolling="no"></iframe>
        </div>
      </div>
    )
  }
};

export default SchedulePage;
