export default function EventsList({ html, state }) {
    const { store } = state
    const allEvents = store.data.sort((a,b) => new Date(b.date) - new Date(a.date))

    let now = new Date().toISOString().split('T')[0]
    let pastEvents  = allEvents.filter(e => e.date < now)

    if (pastEvents.length > 0) {
      return html`
      <style>
      @media only screen and (min-width: 768px) {
        :host {
          display: flex;
          flex-wrap: wrap;
          align-items: flex-start;
        }
      }
      ul {
        margin: 0;
        padding: 0;
      }
      li {
        list-style-type: none;
      }
    </style>
    <ul>
        ${pastEvents.map(
            e => `
            <li >
              <a href="/events/${e.id}">
                ${e.title}
              </a>
            </li>`
          )
          .join('')}
    </ul>
      `
    }else {
        return `
        <p>Wait for it...</p>
        `
    }
  }
