import { events } from './events.mjs'
import { talks } from './talks.mjs'
import { speakers } from './speakers.mjs'
import { organizers } from './organizers.mjs'
import { sponsors } from './sponsors.mjs'

function inflateTalk(talk_id) {
  let talk = talks.find(t => t.id === talk_id)
  if (talk.speaker_id) {
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

function filterFutureEvents() {
  const ONE_DAY = 1000 * 60 * 60 * 24
  return events.filter(
    t => new Date(`${t.date}T21:00-08:00`).getTime() + ONE_DAY > Date.now()
  )
}

/**
 * Load upcoming events + all organizers + all sponsors
 */
export async function get() {
  let events = filterFutureEvents().map(inflateEvent)
  return {
    json: { events, organizers, sponsors }
  }
}
