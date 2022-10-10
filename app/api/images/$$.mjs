import arc from '@architect/functions'

export async function get(req) {
  let { path } = req
  return {
    location: arc.static(path)
  }
}