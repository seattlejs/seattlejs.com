import { h, Component } from "preact";
import speakers from "../../../data/speakers";
import styles from "./speakers.css";
import Speaker from "../../components/speaker/speaker";

class SpeakerPage extends Component {

  constructor(props) {
    super(props);

    this.state = {
      speakers,
      selectedSpeaker: speakers[0]
    };

    this.selectSpeaker = this.selectSpeaker.bind(this);
  }

  selectSpeaker(speaker) {
    this.setState({
      selectedSpeaker: speaker
    });
  }

  render() {

    const {
      selectedSpeaker,
      speakers,
    } = this.state;

    return (
      <div className={styles.speakers}>
        <div className={styles.speakersSidebar}>
          <h1 className={styles.speakersHeadline}>Our Decadent Speakers</h1>
          {
            speakers.map((speaker, i) => (
              <Speaker
                key={i}
                speaker={speaker}
                selected={selectedSpeaker === speaker}
                onClick={this.selectSpeaker}
              />
            ))
          }
        </div>

        <div className={styles.featuredSpeaker}>
          <div className={styles.featuredTop}>
            <div className={styles.imageContainer}>
              <img src={selectedSpeaker.image} alt={selectedSpeaker.name} />
            </div>
            <div className={styles.topContent}>
              <h5 className={styles.name}>{selectedSpeaker.name}</h5>
              <p className={styles.bio}>{selectedSpeaker.bio}</p>
            </div>
          </div>
          <span className={styles.title}>{selectedSpeaker.title}</span>
          <p className={styles.synopsis}>{selectedSpeaker.synopsis}</p>
        </div>
      </div>
    )
  }
};

export default SpeakerPage;
