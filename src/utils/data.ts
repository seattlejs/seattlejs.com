import speakers from '@/data/speakers.json'
import talks from '@/data/talks.json'
import sponsors from '@/data/sponsors.json'

export interface SJSEvent {
  id: string
  title: string
  date: string
  link?: string
  description?: string
  location?: string
  sponsors: string[]
  talks: string[]
}

export interface InflatedEvent extends Omit<SJSEvent, 'talks' | 'sponsors'> {
  talks: InflatedTalk[]
  sponsors: Sponsor[]
}

export interface Speaker {
  id: string
  name: string
  company: string
  twitter?: string
  pronouns?: string
  photo: string
  location?: string
}

export interface Talk {
  id: string
  speaker_id: string
  event_id: string
  title: string
  abstract: string
  type?: string
  topics?: string[]
}

export interface InflatedTalk extends Talk {
  speaker: Speaker
}

export interface Sponsor {
  id: string
  url: string
  image: string
  name?: string
  copy?: string
}

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

export function inflateSponsors(sponsor_id: string): Sponsor {
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
