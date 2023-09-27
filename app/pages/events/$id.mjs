import { marked } from "marked"

export default function ({ html, state = {} }) {
  let { store = {} } = state
  let { event } = store

  return html`
    <page-layout title=${event.title}>
      <pre>${JSON.stringify(event, null, 2)}</pre>
      <h3>${event.title}</h3>
      ${event.description && `<p>${marked(event.description)}</p>` }

      <h4>Thanks to our Sponsors ❤️</h4>
      <event-sponsors ></event-sponsors>
      <div class="cta">
        talks?
      </div>

      <div class="">
        <a target="_self" href="/events">
          See all past events <i class="fa-solid fa-arrow-right"></i>
        </a>
      </div>
    </page-layout>
  `
}
