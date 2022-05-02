let arc = require('@architect/functions')

module.exports = function Layout ({ path, title, content }) {
  return /*html*/`
  <!doctype html>
  <html lang="en">
      <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>SeattleJS ${ title ? `- ${ title }` : `` }</title>
          <link rel="stylesheet" href="https://use.typekit.net/nln6hzq.css">
          <link rel="stylesheet" href="${ arc.static('/styles/main.css') }">
          <!-- ${ path } -->
      </head>
      <body>
      <header>
          <a href="/">home</a>
      </header>
      <div id="main">
      ${ content}
      </div>
      <footer>
      </footer>
      </body>
  </html>
`
}
