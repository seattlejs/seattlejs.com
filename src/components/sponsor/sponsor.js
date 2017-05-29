import { h } from "preact";
import classnames from "classnames";
import styles from "./sponsor.css";

const Sponsor = ({className, image, body, name, url}) => (
  <div className={classnames(className, styles.sponsor)}>
    {
      image &&
      <a href={url} className={styles.imageContainer}>
        <img className={styles.image} src={image} alt={name} />
      </a>
    }
    {
      body &&
      <p className={styles.body}>{body}</p>
    }
  </div>
);

export default Sponsor;
