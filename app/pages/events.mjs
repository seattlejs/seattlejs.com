export default function ({ html, state = { } }) {
  let { store = { } } = state
  let { events } = store
  console.log(events)
  return html`
    <my-layout>
      <div id="page">
        <div class="page-title"><h1>Our Events</h1></div>
        <div class="page-body">
          <ul>
              ${ events.map(e => /*html*/`<li>${ e.title }</li>`).join('') }
          </ul>
        </div>
      </div>
    </my-layout>
`
}
