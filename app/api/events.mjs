import data from '../data/events.json' assert { type: 'json' }
import { inflateSponsors } from './sponsors.mjs'
import { inflateTalk } from './talks.mjs'
export async function get() {
  return {
    json: { data }
  }
}

export const events = data

export function inflateEvent(event) {
  let inflatedEvent = { ...event }
  if (event.talks) {
    inflatedEvent.talks = event.talks.map(inflateTalk)
  }
  if (event.sponsors) {
    inflatedEvent.sponsors = event.sponsors.map(inflateSponsors)
  }
  return inflatedEvent
}
