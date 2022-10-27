import { events } from '../events.mjs'

export async function get (req) {
  let { id } = req.params
  let event = events.find(s => s.id === id)
  return {
    json: { event }
  }
}