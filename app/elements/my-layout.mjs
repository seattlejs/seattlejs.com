export default function ({ html }) {
  return html`
    <my-header></my-header>
    <div id="main">
      <slot></slot>
    </div>
    <my-footer></my-footer>
  `
}
