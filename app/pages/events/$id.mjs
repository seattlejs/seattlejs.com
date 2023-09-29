import { marked } from "marked"

export default function ({ html, state = {} }) {
  let { store = {} } = state
  let event = store.events[0]
  let hasTalks = event.talks && event.talks.length > 0

  if (event) {
  return html`
  <page-layout title=${event.title}>
      <h3>${event.title}</h3>
      ${event.description && `<p>${marked(event.description)}</p>` }
      <h4>Thanks to our Sponsors ❤️</h4>
      ${event.sponsors ? html`<list-sponsors></list-sponsors>` : null}
      ${hasTalks ? html`<list-talks event_id="${event.id}"></list-talks>`: html`<p>No talks were given durring this event.</p>`}
      <div class="">
        <a target="_self" href="/events">
          See all past events <i class="fa-solid fa-arrow-right"></i>
        </a>
      </div>
    </page-layout>
  `
  } else {
    return html`
    <page-layout title="Event not found">
      <h3>Event not found</h3>
      <div class="">
        <a target="_self" href="/events">
          See all past events <i class="fa-solid fa-arrow-right"></i>
        </a>
      </div>
    </page-layout>
  `
  }
}
