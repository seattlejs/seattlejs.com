export default function ({ html, state = {} }) {
  let { store } = state
  let talks = [...Object.values(store)]

  return html`
    <my-layout>
      <div id="page">
        <div class="page-title"><h1>Talk List</h1></div>
        <div class="page-body">
          <p> past talks
          <ul>
            ${talks.map(t => /*html*/ `<li>${t.title} - Speaker: ${t.speaker_id.split('-').join(' ')}</li>`).join('')}
          </ul>
        </div>
      </div>
    </my-layout>
  `
}
