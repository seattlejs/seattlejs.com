export default function ListTalks({ html, state = {} }) {
  const { store, attrs } = state
  const { events } = store
  let { event_id } = attrs
  let event = events.find(e => e.id === event_id)
  let { talks } = event
  return html`
    <style>
      @media only screen and (min-width: 768px) {
        :host {
          display: flex;
          flex-wrap: wrap;
          align-items: flex-start;
  	      justify-content: center;
        }
      }
    </style>
    ${ talks.length === 0
    ? `<p>There are no talks at the moment, maybe <a href="/speak">propose one</a>?</p>`
    : talks.map(t => `<view-talk id="${t.id}" event_id="${event_id}"></view-talk>`).join('')}
`}
