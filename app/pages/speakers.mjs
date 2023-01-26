export default function ({ html, state = {} }) {
  let { store = {} } = state
  let { speakers } = store
  return html`
    <my-layout>
      <div id="page">
        <div class="page-title"><h1>Speaker List</h1></div>
        <div class="page-body">
          <ul>
            ${speakers
              .map(
                s =>
                  /*html*/ `<li><a href="/speakers/${s.id}">${s.name}</a></li>`
              )
              .join('')}
          </ul>
        </div>
      </div>
    </my-layout>
  `
}
