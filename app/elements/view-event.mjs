import { marked } from 'marked'

export default function ViewEvent({ html, state = {} }) {
  const { attrs, store } = state

  let { events } = store
  let { id } = attrs
  let event = events.find(e => e.id === id)
  return html`
    <h3>${event.title}</h3>
    <p>${marked(event.description)}</p>
    <h4>Thanks to our Sponsors ❤️</h4>
    ${event.sponsors
      .map(
        s =>
          `<view-sponsor
          image="${s.image}"
          url="${s.url}"
          copy="${s.copy}"
          name="${s.name}"
          tier="platinum"
        ></view-sponsor>`
      )
      .join('')}
    <div class="cta">
      <a target="_blank" href="https://ti.to/event-loop/seattlejs-${event.id}"
        >More Info & Tickets <i class="fa-solid fa-ticket"></i
      ></a>
    </div>
    <list-talks event_id="${event.id}"></list-talks>
    <div class="">
      <a target="_self" href="/events">
        See all past events <i class="fa-solid fa-arrow-right"></i>
      </a>
    </div>
  `
}
