import { event } from '../conf.mjs'

export async function get(req) {
  let { id } = req.params
  let talk = event.talks.find(t => t.id === id)
  return {
    json: { talk }
  }
}
