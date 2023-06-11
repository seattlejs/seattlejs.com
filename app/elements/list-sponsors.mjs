export default function ListSponsors({ html, state = {} }) {
  const { store = {} } = state
  const { sponsors } = store
  if (sponsors.length > 0) {
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
      ${sponsors
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
