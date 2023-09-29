import events from '../../data/events.json' assert { type: 'json' }
import sponsors from '../../data/sponsors.json' assert { type: 'json' }
import talks from '../../data/talks.json' assert { type: 'json' }
import speakers from '../../data/speakers.json' assert { type: 'json' }

function inflateTalk(talk_id) {
  let talk = talks.find(t => t.id === talk_id)
  if (talk && talk.speaker_id) {
    talk.speaker = speakers.find(s => s.id === talk.speaker_id)
  }
  return talk
}

function inflateSponsors(sponsor_id) {
  return sponsors.find(s => s.id === sponsor_id)
}

function inflateEvent(event) {
  if (event.talks) {
    event.talks = event.talks.map(inflateTalk)
    event.sponsors = event.sponsors.map(inflateSponsors)
  }
  return event
}

export async function get(req) {
  let inflatedEvents = events.map(inflateEvent)
  let event = [inflatedEvents.find(e => e.id === req.params.id)]
  let eventSponsors = event[0].sponsors
  let eventTalks = event[0].talks
  return {
    json: {
      events: event,
      sponsors: eventSponsors,
      talks: eventTalks
    }
  }
}
