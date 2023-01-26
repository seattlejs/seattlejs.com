export default function ListOrganizers({ html, state = {} }) {
  const { store = {} } = state
  const { organizers } = store
  return html` ${organizers
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
    .join('')}`
}
