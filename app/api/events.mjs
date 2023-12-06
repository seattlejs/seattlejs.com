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
  if (inflatedEvent.talks) {
    inflatedEvent.talks = inflatedEvent.talks.map(inflateTalk)
    console.log('Before:', inflatedEvent.sponsor)
    inflatedEvent.sponsors = inflatedEvent.sponsors.map(inflateSponsors)
    console.log('After:', inflatedEvent.sponsor)
  }
  return inflatedEvent
}
