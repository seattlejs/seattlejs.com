export default function EventsList({ html, state }) {
    const { store } = state
    const events  = store.data

    if (events.length > 0) {
      return html`
      <style>
      @media only screen and (min-width: 768px) {
        :host {
          display: flex;
          flex-wrap: wrap;
          align-items: flex-start;
  	      justify-content: center;
        }
      }
      li {
        list-style-type: none;
      }
    </style>
    <ul>

        ${events.sort((a,b) => new Date(b.date) - new Date(a.date))
          .map(
            e => `
            <li class=>
              ${e.title}
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
