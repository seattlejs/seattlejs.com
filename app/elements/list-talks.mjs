export default function ListTalks({ html, state = { } }) {
  const { store, attrs } = state
  const { events } = store
  let { event_id } = attrs
  let event = events.find(e => e.id === event_id)
  let { talks } = event
  if (talks.length === 0) {
    return html`<p>There are no talks at the moment, maybe propose one?</p>`
  }
  else {
    return html`
      ${ talks.map(t => html` 
        <view-talk id="${ t.id }" event_id="${ event_id }"></view-talk>`).join('') }
    `
  }
}