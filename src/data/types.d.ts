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
  photo: string
  twitter?: string
  pronouns?: string
  location?: string
}

interface Talk {
  id: string
  title: string
  abstract: string
  topics?: string[]
  type?: string
}

export interface MeetupTalk extends Talk {
  event_id: string
  speaker_id: string
}

export interface ConfTalk extends Talk {
  speaker: Speaker
}

export interface InflatedTalk extends Talk {
  speaker: Speaker
}

export interface Sponsor {
  tier?: string
  id: string
  url: string
  image: string
  name?: string
  copy?: string
}

export interface Links {
  linkedin?: string
  twitter?: string
  url?: string
  github?: string
}
