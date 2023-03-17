import {
  makeSpeakerId,
  makeTalkId,
  normalizeTalkTitle,
  normalizeTalkAbstract
} from './normalizers.js'

const talkShape = {
  id: '',
  speaker_id: '',
  event_id: '',
  title: '',
  abstract: '',
  type: '' // 'lightning' || 'regular'
}

export default (airtableSpeakers, eventsData) => {
  const talksData = []
  const eventsTalksMap = {}
  for (let speaker of airtableSpeakers) {
    const data = { ...talkShape }
    const speakerId = makeSpeakerId(speaker.get('Full Name'))
    // This is actively bad, at some point a speaker might have more than one event.
    // Here we just take the most recent (hopefully).
    const airtableEventIds = speaker.get('Events')
    if (airtableEventIds) {
      const airtableEventId = airtableEventIds.slice(-1)
      const eventId = eventsData[airtableEventId].id
      const talkId = makeTalkId(speakerId, eventId)
      data.id = talkId
      data.speaker_id = speakerId
      data.event_id = eventId
      data.title = normalizeTalkTitle(speaker.get('Talk Title'))
      data.abstract = normalizeTalkAbstract(speaker.get('Talk Blurb'))
      const talkType = speaker.get('Talk Type')
      if (
        typeof talkType != 'undefined' &&
        talkType.toLowerCase().includes('lightning')
      ) {
        data.type = 'lightning'
      } else {
        data.type = 'regular'
      }
      talksData.push(data)
      // in an effort to keep this a pure-ish function, returning a map seems okay,
      // even if it's not great
      eventsTalksMap[airtableEventId] = eventsTalksMap[airtableEventId] || []
      eventsTalksMap[airtableEventId].push(talkId)
    }
  }
  return { talksData, eventsTalksMap }
}
