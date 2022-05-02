let exists = require('fs').existsSync
let join = require('path').join
let arc = require('@architect/functions')
let PageView = require('@architect/views/pages')
let NotFoundView = require('@architect/views/404')
let manifest = require('@architect/shared/static.json')

// return true if the markdown file exists, false otherwise
function pageExists(path) {
  let page = path.substr(1)
  let md = join(process.cwd(), 'node_modules', '@architect', 'views', 'content', `${ page }.md`)
  let html = join(process.cwd(), 'node_modules', '@architect', 'views', 'content', `${ page }.html`)
  return exists(md) || exists(html)
}

// return truthy if the asset requested is in our static manifest JSON, falsy otherwise
function staticExists(path) {
  let asset = path.substr(1)
  return manifest[asset]
}

/**
 * This router passes the request to the appropriate view or static asset
 */
async function Router (req) {
  // the path matches a markdown file in our filesystem
  if (pageExists(req.path)) {
    return await PageView(req)
  }
  // the path matches a static file we know about
  else if (staticExists(req.path)) {
    return {
      statusCode: 301,
      headers: {
        location: arc.static(req.path)
      }
    }
  }
  else return
}

exports.handler = arc.http.async(Router, NotFoundView)