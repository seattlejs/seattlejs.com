import { talks } from '../talks.mjs'
import { speakers } from '../speakers.mjs'

export async function get(req) {
  const { id } = req.params
  const talk = talks.find(t => t.id === id)
  // inflate the speaker property
  const speaker = speakers.find(s => s.id === talk.speaker_id)
  talk.speaker = speaker
  return {
    json: { talk }
  }
}
