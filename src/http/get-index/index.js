let arc = require('@architect/functions')
let talks = require('@architect/shared/talks.json')
let IndexView = require('@architect/views/index')
let NotFoundView = require('@architect/views/404')

async function Router (req) {
  if (req.path === '/') {
    return await IndexView({ talks })
  }
}

exports.handler = arc.http.async(Router, NotFoundView)