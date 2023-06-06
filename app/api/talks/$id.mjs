import { talks } from '../talks.mjs'

export async function get(req) {
  let { id } = req.params
  let talk = talks.find(t => t.id === id)
  return {
    json: { talk }
  }
}
