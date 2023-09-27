import events from '../../data/events.json' assert { type: 'json' }
import sponsors from '../../data/sponsors.json' assert { type: 'json' }
import talks from '../../data/talks.json' assert { type: 'json' }
import speakers from '../../data/speakers.json' assert { type: 'json' }

export async function get(req) {
  let { id } = req.params

  let event = events.find(s => s.id === id)
  let eventSponsors = sponsors.filter(s => event.sponsors.includes(s.id))

  let eventTalks = event.talks ?talks.filter(t => {
    return event.talks.includes(t.id)
  }) : []

  let eventSpeakers = eventTalks ? speakers.filter(s => {
    return eventTalks.map(t => t.speaker_id).includes(s.id)
  }) : []

  return {
    json: { event, eventSponsors, eventTalks, eventSpeakers }
  }
}
