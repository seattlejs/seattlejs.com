import { h } from "preact";
import Container from "./container";
import { tagline } from '../styles.css';

const Tagline = (props) => (
  <Container wrapperClassName={tagline} {...props}/>
);

export default Tagline;
