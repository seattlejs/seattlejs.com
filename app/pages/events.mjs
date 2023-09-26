export default function events({ html }) {

  return html`
    <my-layout>
      <div id="page">
        <div class="page-title"><h1>Our Past Events</h1></div>
        <div class="page-body">
          <events-list></events-list>
        </div>
      </div>
    </my-layout>
  `
}
