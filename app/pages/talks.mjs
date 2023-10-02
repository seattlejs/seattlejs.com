export default function ({ html, state = {} }) {
  let { store } = state
  let talks = [...Object.values(store)]

  return html`
    <style>
      ul {
        padding: 0;
      }
      li {
        list-style-type: none;
        padding-bottom: 0.5em;
      }
    </style>
    <my-layout>
      <div id="page">
        <div class="page-title"><h1>Past Talks</h1></div>
        <div class="page-body">
          <ul>
            ${talks
              .map(
                t => /*html*/ `<li>${t.title} - Speaker: ${t.speaker.name}</li>`
              )
              .join('')}
          </ul>
        </div>
      </div>
    </my-layout>
  `
}
