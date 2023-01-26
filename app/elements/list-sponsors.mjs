export default function ListSponsors({ html, state = {} }) {
  const { store = {} } = state
  const { sponsors } = store
  if (sponsors.length > 0) {
    return html`
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
