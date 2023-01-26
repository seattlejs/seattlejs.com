export default function ({ html, state = {} }) {
  let { store = {} } = state
  let { env } = store
  console.log(env)
  return html`
    <pre>
        Do not implement this output until it is locked behind a password or auth or some kind!
    </pre
    >
  `
}
