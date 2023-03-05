require('dotenv').config()
const Airtable = require('airtable')
const prompts = require('prompts')
const yargs = require('yargs/yargs')
const getAirtableData = require('./src/airtable').getAirtableData
const getAirtableSponsors = require('./src/airtable').getAirtableSponsors
const mapSpeakers = require('./src/speakers').mapSpeakers
const mapTalks = require('./src/talks').mapTalks
const mapSponsors = require('./src/sponsors').mapSponsors

Airtable.configure({
  apiKey: process.env.AIRTABLE_TOKEN,
  endpointUrl: 'https://api.airtable.com'
})
const airtableBase = Airtable.base(process.env.BASE_ID)

const argv = yargs(process.argv.slice(2))
  .boolean('s')
  .describe('s', 'output speaker images and json to add to the website')
  .alias('s', 'speakers')
  .boolean('t')
  .describe('t', 'output talks json to add to the website')
  .alias('t', 'talks')
  .boolean('S')
  .describe('S', 'output sponsor image(s) and json to add to the website')
  .alias('S', 'sponsors').argv
;(async () => {
  if (argv.speakers || argv.talks) {
    const airtableData = await getAirtableData(airtableBase, prompts)
    if (argv.speakers) {
      mapSpeakers(airtableData.speakerObjects)
    }
    if (argv.talks) {
      mapTalks(airtableData.eventObj, airtableData.speakerObjects)
    }
  }
  if (argv.sponsors) {
    const airtableSponsors = await getAirtableSponsors(airtableBase, prompts)
    mapSponsors(airtableSponsors)
  }
})()
