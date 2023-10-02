import data from '../data/talks.json' assert { type: 'json' }
import speakers from '../data/speakers.json' assert { type: 'json' }

export async function get() {

  return {
    json: data.map(t => {
        let speaker = speakers.find(s => s.id === t.speaker_id)
        return {
          id: t.id,
          event_id: t.event_id,
          title: t.title,
          abstract: t.abstract,
          speaker,
        }
      })
  }
}

export const talks = data

export function inflateTalk(talk_id) {
  let talk = talks.find(t => t.id === talk_id)
  if (talk.speaker_id) {
    talk.speaker = speakers.find(s => s.id === talk.speaker_id)
  }
  return talk
}
