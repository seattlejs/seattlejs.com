export default function ListEvents({ html, state = {} }) {
  const { store = {} } = state
  const { events } = store
  if (events.length === 0) {
    return ''
  } else {
    return html`
      ${events.map(e => html` <view-event id="${e.id}"></view-event>`).join('')}
    `
  }
}
