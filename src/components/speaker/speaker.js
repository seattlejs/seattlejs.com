import classnames from "classnames";
import { h } from "preact";
import styles from "./speaker.css";

const Speaker = ({onClick, speaker, selected}) => {

  const {
    bio,
    image,
    name,
    synopsis,
    title
  } = speaker;

  const _onClick = () => {
    return onClick(speaker);
  };

  return (
    <button tabindex="0"
      className={classnames(styles[`selected-${selected}`], styles.speaker)}
      onClick={_onClick}
    >
      <span className={styles.image}>
        <img src={image} alt={name} />
      </span>

      <div className={classnames("copy__styles__24m_0", styles.content)}>
        <span className={styles.name}>{name}</span>
        <p className={styles.bio} dangerouslySetInnerHTML={{__html: bio}}></p>
        <span className={styles.title}>{title}</span>
        <p className={styles.synopsis}>{synopsis}</p>
      </div>
    </button>
  )
};

export default Speaker;
