import { marked } from "marked"

export default function ({ html, state = {} }) {
  let { store = {} } = state
  let event = store.events[0]
  let { id, title, sponsors, talks, description } = event
  let hasTalks = talks && talks.length > 0
  let hasSponsors = sponsors && sponsors.length > 0
  return html`
  <page-layout title=${title}>
      <h3>${title}</h3>
      ${description && `<p>${marked(description)}</p>` }
      <h4>Thanks to our Sponsors ❤️</h4>
      ${hasSponsors ? html`<list-sponsors></list-sponsors>` : null}
      ${hasTalks ? html`<list-talks event_id="${id}"></list-talks>`: html`<p>No talks were given durring this event.</p>`}
      <div class="">
        <a target="_self" href="/events">
          See all past events <i class="fa-solid fa-arrow-right"></i>
        </a>
      </div>
    </page-layout>
  `
}
