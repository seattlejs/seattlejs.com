import { existsSync, readFileSync } from 'fs'
import { marked } from 'marked'
import fm from 'front-matter'
import { join } from 'path'
//import MyLayout from '../elements/my-layout.mjs'

/**
 * Page view: catchall for pages authored in markdown
 */
export default function ({ html, state = { } }) {
  let { store = { } } = state
  let { path } = store
  // remove the leading "/" slash
  let page = path.substr(1)
  let doc = join(process.cwd(), 'node_modules', '@architect', 'views', 'md', `${page}.md`)
  if (!existsSync(doc)) {
    return html`
      <my-layout>
        <my-404></my-404>
      </my-layout>
    `
  }
  else {
  // Read the file
    doc = readFileSync(doc).toString()
    // pull out any front-matter key/values
    let { attributes, body } = fm(doc)
    let title = attributes.title || 'The Seattle JavaScript Meetup'

    return html`
      <my-layout>
        <div id="page">
          <div class="page-title">
            <div><h1>${ title }</h1></div>
          </div>
          <div class="page-body">
            ${ marked(body) }
          </div>
        </div>
      </my-layout>`

  }
}
