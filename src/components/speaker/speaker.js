import classnames from "classnames";
import { h } from "preact";
import styles from "./speaker.css";

const Speaker = ({onClick, speaker, selected}) => {

  const {
    image,
    name,
    synopsis,
    title
  } = speaker;

  const _onClick = () => {
    return onClick(speaker);
  };

  return (
    <button tabindex="0" className={classnames(styles[`selected-${selected}`], styles.speaker)} onClick={_onClick}>
      <div className={styles.image}>
        <img src={image} alt={name} />
      </div>
      <div className={styles.content}>
        <span className={styles.name}>{name}</span>
        <span className={styles.title}>{title}</span>
      </div>
    </button>
  )
};

export default Speaker;
