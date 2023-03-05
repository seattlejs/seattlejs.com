exports.mapSpeakers = async airtableSpeakers => {
  const Jimp = require('jimp')
  const fs = require('fs/promises')
  const normalizeTwitterHandle = require('./normalizers').normalizeTwitterHandle
  // this output will make directories if they don't exist
  const SPEAKERS_IMAGE_DIR = '../public/images/speakers'
  // currently this output can't make directories, path must exist
  const SPEAKERS_JSON_OUTPUT = '../app/api/speakers.json'
  const MAX_IMAGE_SIZE_BYTES = 300000

  const speakerShape = {
    id: '',
    name: '',
    company: '',
    photo: '',
    twitter: ''
  }
  const speakersOutput = []
  console.log('writing images to ' + SPEAKERS_IMAGE_DIR)
  for (let speaker of airtableSpeakers) {
    const output = { ...speakerShape }
    const name = speaker.get('Full Name')
    const id = name.toLowerCase().replace(' ', '-')
    output.name = name
    output.id = id
    output.company = speaker.get('Company')
    const twitter = normalizeTwitterHandle(speaker.get('Twitter'))
    output.twitter = twitter
    output.photo = id + '.jpg'
    const photoObj = speaker.get('Photo')[0]
    const imageUrl = photoObj.url
    var image = await Jimp.read(imageUrl)
    // airtable represents image size in bytes
    if (photoObj.size >= MAX_IMAGE_SIZE_BYTES) {
      // default is bilinear, doesn't matter as much for downscaling
      image.resize(500, Jimp.AUTO)
    }
    await image.writeAsync(SPEAKERS_IMAGE_DIR + `/${id}.jpg`)
    speakersOutput.push(output)
  }
  const jsonOutput = JSON.stringify(speakersOutput, null, 4)
  console.log('writing speakers json to ' + SPEAKERS_JSON_OUTPUT)
  await fs.writeFile(SPEAKERS_JSON_OUTPUT, jsonOutput)
}
