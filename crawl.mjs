import fs from 'fs'

const queue = ['https://seattlejs.com/', 'https://seattlejs.com/events']
/** @type {Set<string>} */
// eslint-disable-next-line no-undef
const visited = new Set()

async function crawl() {
  while (queue.length) {
    let url = queue.shift()
    if (!url || visited.has(url)) continue

    visited.add(url)
    console.log(`Crawling ${url}`)

    let res = await fetch(url)
    let text = await res.text()
    let matches = text.match(/https?:\/\/[^'"\s)]+/g) || []

    const links = text.match(/href="([^"]+)"/g) || []
    matches = matches.concat(
      ...links
        .map(m => {
          const url = m.match(/href="([^"]+)"/)[1]
          if (url.match(/^https?:\/\/seattlejs.com/)) return url
          if (url.startsWith('/')) return `https://seattlejs.com${url}`
          return null
        })
        .filter(m => !!m),
    )

    // console.log(matches)

    for (let match of matches) {
      if (match.match(/^https?:\/\/seattlejs.com/)) {
        queue.push(match)
      }
    }
  }
}

await crawl()
fs.writeFileSync('urls.json', JSON.stringify(Array.from(visited), null, 2))
