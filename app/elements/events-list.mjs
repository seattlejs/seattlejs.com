export default function EventsList({ html, state }) {
    const { store } = state
    const events = store.data.sort((a,b) => new Date(b.date) - new Date(a.date))

    if (events.length > 0) {
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
        ${events.map(
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
