import { h } from "preact";
import classnames from "classnames";
import styles from "./sponsor.css";

const Sponsor = ({className, image, body, name, url}) => (
  <a href={url} className={classnames(className, styles.sponsor)}>
    <span className={styles.container}>
    {
      image &&
      <span className={styles.imageContainer}>
        <img className={styles.image} src={image} alt={name} />
      </span>
    }
    {
      body &&
      <p className={styles.body}>{body}</p>
    }
    </span>
  </a>
);

export default Sponsor;
