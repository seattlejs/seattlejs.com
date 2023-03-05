exports.mapSponsors = async airtableSponsors => {
  const Jimp = require('jimp')
  const fs = require('fs/promises')

  const SPONSORS_LOGO_DIR = './images'

  const SPONSORS_JSON_OUTPUT = './sponsors.json'
  const MAX_LOGO_SIZE_BYTES = 500000

  const sponsorShape = {
    id: '',
    url: '',
    image: ''
  }

  const sponsorsOutput = []
  console.log('writing images to', SPONSORS_LOGO_DIR)
  for (let sponsor of airtableSponsors || []) {
    const output = { ...sponsorShape }
    const name = sponsor.get('Name')
    const cleanName = name.replace(/[^a-zA-Z0-9]/g, '').replace(' ', '-')
    output.id = cleanName
    output.url = sponsor.get('Website')
    output.image = cleanName + '.jpg'

    const logoObj = sponsor.get('Logo')[0]
    const logoUrl = logoObj.url
    var logo = await Jimp.read(logoUrl)

    if (logoObj.size >= MAX_LOGO_SIZE_BYTES) {
      logo.resize(300, Jimp.AUTO)
    }
    await logo.writeAsync(SPONSORS_LOGO_DIR + `/${cleanName}.jpg`)
    sponsorsOutput.push(output)
  }
  if (sponsorsOutput) {
    const jsonOutput = JSON.stringify(sponsorsOutput, null, 4)
    console.log('writing speakers json to ' + SPONSORS_JSON_OUTPUT)
    await fs.writeFile(SPONSORS_JSON_OUTPUT, jsonOutput)
  }
}
