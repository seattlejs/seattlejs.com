import data from '@begin/data'
import confData from '../data/conf-2023.json' assert { type: 'json' }

export async function get(req) {
  let playbackId = await data.get({ table: "admin", key: "playbackId" })

  return {
    json: { 
      title: 'SeattleJS Conf',
      description: 'SeattleJS Conf is a very special 1-day conference bringing together ~300 web developers to learn, network and have fun!',
      sharing: {
        image: '/_public/images/seattlejsconf-sharing.png'
      },
      event,
      organizers: event.organizers,
      playbackId: 
        req.query.playbackId // if a playbackId is passed in the query string, it takes precendence
        || (req.query.test != undefined ? 'v69RSHhFelSm4701snP22dYz2jICy4E4FUyk02rW4gxRM' : undefined) // next if "test" is used
        || ( playbackId ? playbackId.value : undefined ) // lastly, the value from the database, if it exists
    }
  }
}

export const event = confData