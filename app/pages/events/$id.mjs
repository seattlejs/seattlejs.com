import { marked } from "marked"

export default function ({ html, state = {} }) {
  let { store = {} } = state
  let event = store.events[0]
  let display = store.display
  let DEFAULT_LOCATION = "The Collective Seattle, 400 Dexter Ave N, Seattle, WA 98109"
  let {
    id,
    title,
    sponsors,
    talks,
    description,
    date,
    location=DEFAULT_LOCATION
  } = event

  let hasTalks = talks && talks.length > 0
  let hasSponsors = sponsors && sponsors.length > 0
  if (display === "email") {
    let eventDate = new Date(date)
    return html`
      <style>
        .container {
          display: block;
          margin: 20px;
        }
      </style>
      <div class="container">
        <button id="copy-html-btn">Copy HTML to clipboard</button>
        <div id="html-contents">
          <p>GREETING TEXT</p>
          <!-- sponsor -->
          ${hasSponsors ? sponsors.map(s => `
            <p>
              <a href="${s.url}"><img width="200" alt="${s.name} logo" src="https://seattlejs.com/_public/images/sponsors/${s.image}" title="${s.name} logo"></a>
            </p>
            <p>Special thanks to our friends at <a href="${s.url}">${s.name}</a> for sponsoring snacks for this month's event! 😎</p>
          `).join('') : null}
          <ul>
            <li>🗓 ${eventDate.toLocaleDateString(undefined, {weekday: "long", month: "long", day: "numeric"})}</li>
            <li>⏰ 5:30pm - 8:30pm</li>
            <li>📍 ${location}</li>
            <li>🎟 <a href="https://ti.to/event-loop/">Buy Tickets</a></li>
          </ul>
          <! -- loop through talks -->
          ${hasTalks ? talks.map(t => `
              <h4 style="font-family: headline-gothic-atf-round, sans-serif; font-weight: 700; font-size: 24px;">${t.title} by ${t.speaker.name}</h4>
              <p><img width="200" alt="${t.title}" src="https://seattlejs.com/_public/images/speakers/${t.speaker.photo}" title="${t.speaker.name}"></p>
              ${description && `<p>${marked(description)}</p>` }
            `).join('') : null }
          <!-- end loop -->
          <p>See you all on ${eventDate.toLocaleDateString(undefined, {month: "long", day: "numeric"})}</p>
        </div>
        <script>
        const copyHTML = async () => {
          const holder = document.getElementById("html-contents")
          await navigator.clipboard.writeText(holder.innerHTML)
        }
        window.addEventListener("DOMContentLoaded", () => {
          const htmlButton = document.getElementById("copy-html-btn")
          htmlButton.addEventListener("click", copyHTML)
        })
        </script>
      </div>
    `
  }
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
