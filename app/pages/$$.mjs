import { marked } from 'marked'

/**
 * Page view: catchall for pages authored in markdown
 */
export default function ({ html, state }) {
  let { store } = state
  let { attributes, body } = store
  let title = attributes?.title
  return html` <my-layout>
    <div id="page">
      <div class="page-title">
        <div><h1>${title}</h1></div>
      </div>
      <div class="page-body">${marked(body)}</div>
    </div>
  </my-layout>`
}
