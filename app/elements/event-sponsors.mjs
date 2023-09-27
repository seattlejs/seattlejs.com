export default function eventSponsors({ html, state = {} }) {
    console.log(`state: ${JSON.stringify(state, null, 2)}`)
    const { store = {} } = state
    const { eventSponsors, event } = store
    console.log(`eventSponsors: ${JSON.stringify(state, null, 2)}`)

    if (event.sponsors.length > 0) {
      return html`
        <style>
          :host div {
            padding: 16px;
          }

          :host img {
            height: 80px;
          }
          @media only screen and (min-width: 768px) {
            :host {
              display: flex;
              flex-wrap: wrap;
            }
          }
        </style>

        ${eventSponsors
          .map(
            s => html` <div>
              <a target="_sponsor" href="${s.url}"
                ><img src="/_public/images/sponsors/${s.image}"
              /></a>
            </div>`
          )
          .join('')}
      `
    }
  }
