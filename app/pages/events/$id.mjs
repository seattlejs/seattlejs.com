export default function ({ html, state = {} }) {
  let { store = {} } = state
  let { event } = store
  return html`
    <page-layout title=${event.title}>
      <pre>${JSON.stringify(event, null, 2)}</pre>
    </page-layout>
  `
}
