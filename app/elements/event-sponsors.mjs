export default function eventSponsors({ html, state = {} }) {
    const { store = {} } = state
    const { eventSponsors } = store

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
              <a target="_blank" href="${s.url}"
                ><img src="/_public/images/sponsors/${s.image}"
              /></a>
            </div>`
          )
          .join('')}
      `

  }
