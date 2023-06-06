export default function ({ html, state = {} }) {
  let { store = {} } = state
  let { talk } = store
  return html`
    <page-layout title=${talk.title}>
      <pre><code language="JSON">${JSON.stringify(talk, null, 2)}</code></pre>
    </page-layout>
  `
}
