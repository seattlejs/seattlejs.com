import { marked } from 'marked'

export default function ViewEvent({ html, state = { } }) {
  const { attrs, store } = state
  let { events } = store
  let { id } = attrs
  let event = events.find(e => e.id === id)
  return html`
    <h3>${ event.title }</h3>
    <p>${ marked(event.description) }</p>
    <div class="cta"><a target="_blank" href="https://ti.to/event-loop/seattlejs-${ event.id }">More Info & Tickets <i class="fa-solid fa-ticket"></i></a></div>
    <list-talks event_id="${ event.id }"></list-talks>
  `
}