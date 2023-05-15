export default function ({ html, state = {} }) {
  let { store = {} } = state
  let { events } = store
  //console.log(events)
  return html`
    <my-layout>
      <div id="page">
        <!-- no title needed -->
        <div class="page-body">
          <img src="/_public/images/seattlejsconf-2023-logo.png" alt="logo for SeattleJS Conf 2023"/>
        </div>
      </div>
    </my-layout>
  `
}
