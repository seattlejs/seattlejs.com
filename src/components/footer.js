import { h } from "preact";
import Container from "./container";
import styles from "../styles.css";

const FooterLink = ({ children, ...restProps }) => (
  <a {...restProps}>
    <span aria-hidden className={styles.footerLinkIcon}>+</span>
    {children}
  </a>
);

const Footer = (props) => (
  <Container tagName="footer" className={styles.innerFooter} {...props }>
    <div className={styles.navList}>
      <FooterLink href="https://github.com/seattlejs/seattlejs/blob/master/code-of-conduct.md">Code of Conduct</FooterLink>
      <FooterLink href="https://twitter.com/seattlejs">Twitter</FooterLink>
    </div>
    <div className={styles.navContactUs}>
      <FooterLink href="mailto:emma.brillhart@formidable.com">Email Us</FooterLink>
    </div>
  </Container>
);

export default Footer;
