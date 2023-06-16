import conf from '../../data/conf-2023.json' assert { type: 'json' }

export async function get(req) {
  const { id } = req.params
  const social = req.query.social !== undefined
  let sharing, workshop, title, description

  workshop = conf.workshops.find(w => w.id === id)
  title = `SeattleJS Conf 2023 - ${ workshop.title }`
  sharing = {
    image: `/_public/images/social/${ workshop.id }.png`,
  }

  description = workshop.abstract

  return {
    json: { workshop, title, description, sharing, social }
  }
}
