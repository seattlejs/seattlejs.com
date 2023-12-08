import events from '../../data/events.json' assert { type: 'json' }
import  { inflateEvent } from '../events.mjs'

export async function get(req) {
  let { path, query } = req
  const event = events.find(e => e.id === req.params.id)
  let display = "page"
  if (query && Object.hasOwn(query, "email")) display = "email"
  if (!event) {
    return {
      statusCode: 404,
      json: {
        path,
        notFound: true
      }
    }
  } 
  else {
    return {
      json: {
        event: inflateEvent(event),
        display
      }
    }
  }
}
