export default function ({ html, state = { } }) {
  let { store = { } } = state
  let { talks } = store
  return html`
    <my-layout>
      <div id="page">
        <div class="page-title"><h1>Talk List</h1></div>
        <div class="page-body">
          <ul>
              ${ talks.map(t => /*html*/`<li>${ t.title }</li>`).join('') }
          </ul>
        </div>
      </div>
    </my-layout>
`
}
