import events from '../../data/events.json' assert { type: 'json' }
import  { inflateEvent } from '../events.mjs'

export async function get(req) {
  let { path } = req
  const event = events.find(e => e.id === req.params.id)

  if (!event) {
    return {
      statusCode: 404,
      json: {
        path,
        notFound: true
      }
    }
  } else {
  // We have to convert event from an object to an array to inflate it
  let inflatedEvent = [event].map(inflateEvent)
  let eventSponsors = event.sponsors
  let eventTalks = event.talks

  // In event/$id we are reusing the element <list-talks> which expects a list of events
  return {
    json: {
      events: inflatedEvent,
      sponsors: eventSponsors,
      talks: eventTalks
    }
  }}
}