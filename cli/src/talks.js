/**
 * Takes speaker objects and maps them to event objects suitable for the website.
 * @param {Object} airtableEvent - Event object from the airtable API
 * @param {Object} airtableSpeakers - Speaker objects from the airtable API.
 */
exports.mapTalks = async (airtableEvent, airtableSpeakers) => {
  const fs = require('fs/promises')
  const TALKS_JSON_OUTPUT = './talks.json'
  const makeEventId = require('./normalizers').makeEventId
  const makeSpeakerId = require('./normalizers').makeSpeakerId
  const makeTalkId = require('./normalizers').makeTalkId
  const normalizeTalkTitle = require('./normalizers').normalizeTalkTitle
  const normalizeTalkAbstract = require('./normalizers').normalizeTalkAbstract
  const talkShape = {
    id: '',
    speaker_id: '',
    event_id: '',
    title: '',
    abstract: ''
  }
  const talksOutput = []
  for (let speaker of airtableSpeakers) {
    const talk = { ...talkShape }
    const speakerId = makeSpeakerId(speaker.get('Full Name'))
    const eventId = makeEventId(airtableEvent.get('Name'))
    talk.id = makeTalkId(speakerId, eventId)
    talk.speaker_id = speakerId
    talk.event_id = eventId
    talk.title = normalizeTalkTitle(speaker.get('Talk Title'))
    talk.abstract = normalizeTalkAbstract(speaker.get('Talk Blurb'))
    talksOutput.push(talk)
  }
  console.log('writing talks json to ', TALKS_JSON_OUTPUT)
  await fs.writeFile(TALKS_JSON_OUTPUT, JSON.stringify(talksOutput, null, 4))
}
