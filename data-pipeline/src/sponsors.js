import { normalizeSponsorName, getFileExtension } from './normalizers.js'

const sponsorShape = {
  id: '',
  url: '',
  image: '',
  copy: ''
}

const logoShape = {
  image: '',
  filename: ''
}

export default airtableSponsors => {
  const sponsorsData = []
  const sponsorsLogos = []
  const eventsSponsorsMap = {}
  for (let sponsor of airtableSponsors || []) {
    const data = { ...sponsorShape }
    const logo = { ...logoShape }
    const name = normalizeSponsorName(sponsor.get('Name'))
    data.id = name
    data.url = sponsor.get('Website')
    const logoObj = sponsor.get('Logo')
    if (typeof logoObj != 'undefined') {
      logo.image = logoObj[0].url
      const fileExtension = getFileExtension(logoObj[0].filename)
      const fileName = `${name}.${fileExtension}`
      logo.filename = fileName
      data.image = fileName
      data.copy = sponsor.get('Web Copy') || ''
    }
    sponsorsLogos.push(logo)
    sponsorsData.push(data)
    const eventIds = sponsor.get('Events')
    if (Array.isArray(eventIds) && eventIds.length) {
      for (let eventId of eventIds) {
        eventsSponsorsMap[eventId] = [] || eventsSponsorsMap[eventId]
        eventsSponsorsMap[eventId].push(name)
      }
    }
  }
  return { sponsorsData, sponsorsLogos, eventsSponsorsMap }
}
