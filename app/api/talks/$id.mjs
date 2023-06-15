import { talks } from '../talks.mjs'
import { speakers } from '../speakers.mjs'
import conf from '../../data/conf-2023.json' assert { type: 'json' }

export async function get(req) {
  const { id } = req.params
  const social = req.query.social !== undefined
  let sharing, talk, title, description

  talk = talks.find(t => t.id === id)
  if (!talk) {
    talk = conf.talks.find(t => t.id === id)
    title = `SeattleJS Conf 2023 - ${ talk.title }`
    sharing = {
      image: `/_public/images/social/${ talk.id }.png`,
    }
  }
  else {
    // inflate the speaker property
    talk.speaker = speakers.find(s => s.id === talk.speaker_id)
  }

  description = talk.abstract

  return {
    json: { talk, title, description, sharing, social }
  }
}
