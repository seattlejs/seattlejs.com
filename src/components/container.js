import { h } from "preact";
import cs from 'classnames';
import styles from '../styles.css';

const Container = ({ tagName="section", children, className, wrapperClassName, ...restProps }) => (
  h(tagName, { ...restProps, className: cs(styles.container, wrapperClassName) },
    h('div', { className }, children)
  )
);

export default Container;
