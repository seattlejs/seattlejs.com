import data from '../data/conf-2023.json' assert { type: 'json' }
export async function get(req) {
  console.log(req.query.test)
  return {
    json: { 
      title: 'SeattleJS Conf',
      description: 'SeattleJS Conf is a very special 1-day conference bringing together ~300 web developers to learn, network and have fun!',
      sharing: {
        image: '/_public/images/seattlejsconf-sharing.png'
      },
      event,
      organizers: event.organizers,
      playbackId: req.query.playbackId || /* pull from DB || */ (req.query.test != undefined ? 'v69RSHhFelSm4701snP22dYz2jICy4E4FUyk02rW4gxRM' : undefined)
    }
  }
}

export const event = data
