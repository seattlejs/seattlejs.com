import { makeEventId } from './normalizers.js'
import { isFuture } from 'date-fns'

const eventsShape = {
  id: '',
  title: '',
  date: '',
  sponsors: [],
  talks: [],
  description: ''
}

const eventInFuture = eventDate => {
  return isFuture(new Date(eventDate))
}

export default airtableEvents => {
  const eventsData = {}
  for (let event of airtableEvents) {
    const data = { ...eventsShape }
    const name = event.get('Name')
    const date = event.get('Date')
    const description = event.get('Description') || ''
    const id = makeEventId(name)
    data.id = id
    data.title = name
    data.date = date
    data.description = description
    eventsData[event.id] = data
    // the website doesn't support having events later than the current one
    // stop going through the (sorted) events when we get to the next one
    if (eventInFuture(date)) {
      break
    }
  }
  return eventsData
}
