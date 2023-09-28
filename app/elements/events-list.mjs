export default function EventsList({ html, state }) {
    const { store } = state
    const allEvents = store.data

    // The last item in the array is the current event
    let pastEvents  = allEvents.sort((a,b) => new Date(b.date) - new Date(a.date)).slice(1)

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
              <a target="_self" href="/events/${e.id}">
                ${e.title}
              </a>
            </li>`
          )
          .join('')}
      `
    }else {
        return `
        <p>Wait for it...</p>
        `
    }
  }
