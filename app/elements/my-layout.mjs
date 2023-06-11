export default function ({ html }) {
  return html`
    <style>
      :host {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
      }
      #main {
        flex: 1;
      }
    </style>
    <my-header></my-header>
    <div id="main">
      <slot></slot>
    </div>
    <my-footer></my-footer>
  `
}
