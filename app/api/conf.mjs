import data from '../data/conf-2023.json' assert { type: 'json' }
export async function get() {
  return {
    json: { 
      title: 'SeattleJS Conf',
      description: 'SeattleJS Conf is a very special 1-day conference bringing together ~300 web developers to learn, network and have fun!',
      sharing: {
        image: '/_public/images/seattlejsconf-share.png'
      },
      event 
    }
  }
}

export const event = data
