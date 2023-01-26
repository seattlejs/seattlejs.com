import { existsSync, readFileSync } from 'fs'
import fm from 'front-matter'
import { join } from 'path'

export async function get(req) {
  let { path } = req
  let page = path.substr(1)
  let filePath = join(
    process.cwd(),
    'node_modules',
    '@architect',
    'views',
    'md',
    `${page}.md`
  )
  if (!existsSync(filePath)) {
    return {
      json: {
        path,
        notFound: true
      }
    }
  } else {
    let file = readFileSync(filePath).toString()
    // pull out any front-matter key/values
    let { attributes, body } = fm(file)
    let title = attributes.title
    return {
      json: {
        path,
        title,
        attributes,
        body
      }
    }
  }
}
