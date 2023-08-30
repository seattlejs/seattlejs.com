export default function ListOrganizers({ html, state = {} }) {
  const { store = {} } = state
  const { organizers } = store
  return html`
    <style>
      .organizer img {
        height: 250px;
        width: 250px;
      }

      .name {
        font-family: headline-gothic-atf-round, sans-serif;
        font-weight: 700;
        font-size: 24px;
      }
      @media only screen and (min-width: 768px) {
        :host {
          display: flex;
          flex-wrap: wrap;
        }

        .organizer {
          margin: 8px;
        }
      }
    </style>
    ${organizers
      .map(
        o => html` <div class="organizer">
          <p>
            <img
              src="/_public/images/organizers/${o.id}.jpg"
              alt="photo of ${o.full_name}"
            />
          </p>
          <p>
            <div class="name">${o.full_name}</div>
            ${o.role ? `${o.role} <br />` : ''}
            <list-links links=${o.links}></list-links>
          </p>
        </div>`
      )
      .join('')}
  `
}
