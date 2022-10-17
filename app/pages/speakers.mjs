export default function ({ html, state = { } }) {
  let { store = { } } = state
  let { speakers } = store
  return html`
    <my-layout>
      <div id="page">
        <div class="page-title"><h1>Our Speakers</h1></div>
        <div class="page-body">
          <ul>
              ${ speakers.map(s => /*html*/`<li>${ s.name }</li>`).join('') }
          </ul>
        </div>
      </div>
    </my-layout>
`
}
