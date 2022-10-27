export default function ViewEvent({ html, state = { } }) {
  const { attrs, store } = state
  let { events } = store
  let { id } = attrs
  let event = events.find(e => e.id === id)
  return html`
    <h3>${ event.title }</h3>
    <list-talks event_id="${ event.id }"></list-talks>
  `
}