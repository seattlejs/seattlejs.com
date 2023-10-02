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
  if (event.talks) {
    event.talks = event.talks.map(inflateTalk)
    event.sponsors = event.sponsors.map(inflateSponsors)
  }
  return event
}
