export default function({ html, state }) {
  return html`
    <my-layout>
      <div id="page">
        <div class="page-title"><h1>${ state.title }</h1></div>
        <div class="page-body">
          <slot></slot>
        </div>
      </div>
    </my-layout>
    `
}