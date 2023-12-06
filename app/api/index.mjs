import { events, inflateEvent } from './events.mjs'
import { organizers } from './organizers.mjs'
import { sponsors } from './sponsors.mjs'

function filterFutureEvents() {
  const TWELVE_HOURS = 1000 * 60 * 60 * 12
  return events.filter(
    t => new Date(`${t.date}T21:00-08:00`).getTime() + TWELVE_HOURS > Date.now()
  )
}

/**
 * Load upcoming events + all organizers + all sponsors
 */
export async function get() {
  let filteredEvents = filterFutureEvents().map(inflateEvent)
  return {
    json: { events: filteredEvents, organizers, sponsors }
  }
}
