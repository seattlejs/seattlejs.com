export default function ViewEvent({ html, state = { } }) {
  const { attrs, store } = state
  let { events } = store
  let { id } = attrs
  let event = events.find(e => e.id === id)
  return html`
    <h3>${ event.title }</h3>
    <list-talks event_id="${ event.id }"></list-talks>
    <p><a target="_blank" href="https://ti.to/event-loop/seattlejs-${ event.id }">More Info</a></p>
  `
}