import * as dotenv from 'dotenv'
import Airtable from 'airtable'
import {
  getAirtableEvents,
  getAirtableSpeakers,
  getAirtableSponsors
} from './src/airtable.js'
import mapEvents from './src/events.js'
import mapSpeakers from './src/speakers.js'
import mapTalks from './src/talks.js'
import mapSponsors from './src/sponsors.js'
import { exportImages, exportData } from './src/exporters.js'

dotenv.config()

Airtable.configure({
  apiKey: process.env.AIRTABLE_TOKEN,
  endpointUrl: 'https://api.airtable.com'
})
const airtableBase = Airtable.base(process.env.BASE_ID)

;(async () => {
  const airtableEvents = await getAirtableEvents(airtableBase)
  const airtableSpeakers = await getAirtableSpeakers(airtableBase)
  const airtableSponsors = await getAirtableSponsors(airtableBase)
  // handle speaker objects
  const { speakersData, speakersImages } = mapSpeakers(airtableSpeakers)
  await exportImages(speakersImages, 'speakers')
  await exportData(speakersData, 'speakers')

  // add relations to events from talks and sponsors
  const events = mapEvents(airtableEvents)
  const { talksData, eventsTalksMap } = mapTalks(airtableSpeakers, events)
  await exportData(talksData, 'talks')
  for (let event in eventsTalksMap) {
    events[event].talks = eventsTalksMap[event] || []
  }
  const { sponsorsData, sponsorsLogos, eventsSponsorsMap } =
    mapSponsors(airtableSponsors)
  await exportData(sponsorsData, 'sponsors')
  await exportImages(sponsorsLogos, 'sponsors')

  for (let event in eventsSponsorsMap) {
    events[event].sponsors = eventsSponsorsMap[event] || []
  }
  await exportData(Object.values(events), 'events')
})()
