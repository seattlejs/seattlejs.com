import { h } from "preact";
import Container from "./container";
import styles from "../styles.css";

const Footer = (props) => (
  <Container tagName="footer" className={styles.innerFooter} {...props }>
    <div className={styles.navList}>
      <a href="https://github.com/seattlejs/seattlejs/blob/master/code-of-conduct.md">Code of Conduct</a>
      <a href="https://twitter.com/seattlejs">Twitter</a>
    </div>
    <div className={styles.navContactUs}>
      <a href="mailto:conference@seattlejs.com">conference@seattlejs.com</a>
    </div>
  </Container>
);

export default Footer;
