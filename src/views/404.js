let Layout = require('./layout')

module.exports = function notFound (req) {
    // Return 404
    let content = `<video autoplay muted loop width="100%">
      <source type="video/mp4" src="https://media.giphy.com/media/jkZtSdwKOx05BOlapR/source.mp4?cid=ecf05e474kgt0ax6stge6re5otcyqmhf7p7bx1ncirx3lp2q&rid=source.mp4&ct=g">
    </video>`
    let html = Layout({ path: req.path, content })
    return {
      html,
      status: 404
    }
  }