import speakers from '@/data/speakers.json'
import talks from '@/data/talks.json'
import sponsors from '@/data/sponsors.json'
import type {
  InflatedEvent,
  InflatedTalk,
  SJSEvent,
  Sponsor,
} from '@/data/types'

export function inflateEvent(event: SJSEvent): InflatedEvent {
  let inflatedEvent: InflatedEvent = { ...event, talks: [], sponsors: [] }
  if (event.talks) {
    inflatedEvent.talks = event.talks.map(inflateTalk)
  }
  if (event.sponsors) {
    inflatedEvent.sponsors = event.sponsors.map(inflateSponsors)
  }
  return inflatedEvent
}

function inflateSponsors(sponsor_id: string): Sponsor {
  let sponsor = sponsors.find(s => s.id === sponsor_id)
  if (!sponsor) throw new Error(`Sponsor not found: ${sponsor_id}`)
  return sponsor
}

export function inflateTalk(talk_id: string): InflatedTalk {
  let talk = talks.find(t => t.id === talk_id)
  if (!talk) throw new Error(`Talk not found: ${talk_id}`)

  let speaker = speakers.find(s => s.id === talk.speaker_id)
  if (!speaker) throw new Error(`Speaker not found: ${talk.speaker_id}`)

  return {
    ...talk,
    speaker,
  }
}
