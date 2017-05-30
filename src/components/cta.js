import { h } from "preact";
import Container from "./container";
import styles from "../styles.css";

const CTA = (props) => <Container className={styles.cta} {...props } />;

export default CTA;
