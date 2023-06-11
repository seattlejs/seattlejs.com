export default function ListOrganizers({ html, state = {} }) {
  const { store = {} } = state
  const { organizers } = store
  return html`
    <style>
        .organizer img {
          height: 250px;
          width: 250px;
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
            ${o.full_name}<br />
            ${o.twitter
              ? `<a target="_blank" href="https://twitter.com/${o.twitter}">@${o.twitter}</a></p>`
              : ''}
          </p>
        </div>`
      )
      .join('')}
`}
