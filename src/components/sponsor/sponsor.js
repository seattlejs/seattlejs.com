import { h } from "preact";
import classnames from "classnames";
import styles from "./sponsor.css";

const Sponsor = ({className, image, body, name}) => (
  <div className={classnames(className, styles.sponsor)}>
    {
      image &&
      <div className={styles.imageContainer}>
        <img className={styles.image} src={image} alt={name} />
      </div>
    }
    {
      body &&
      <p>{body}</p>
    }
  </div>
);

export default Sponsor;
