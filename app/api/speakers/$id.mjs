import { speakers } from '../speakers.mjs'

export async function get (req) {
  let { id } = req.params
  let speaker = speakers.find(s => s.id === id)
  return {
    json: { speaker }
  }
}