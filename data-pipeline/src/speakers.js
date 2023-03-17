import {
  normalizeTwitterHandle,
  makeSpeakerId,
  getFileExtension
} from './normalizers.js'

const speakerShape = {
  id: '',
  name: '',
  company: '',
  photo: '',
  twitter: ''
}

const photoShape = {
  image: '',
  filename: ''
}

export default airtableSpeakers => {
  const speakersData = []
  const speakersImages = []
  for (let speaker of airtableSpeakers) {
    const data = { ...speakerShape }
    const photo = { ...photoShape }
    const name = speaker.get('Full Name')
    const id = makeSpeakerId(name)
    data.name = name
    data.id = id
    data.company = speaker.get('Company')
    const twitter = normalizeTwitterHandle(speaker.get('Twitter'))
    data.twitter = twitter
    const photoObj = speaker.get('Photo')
    // some speakers don't have photos
    if (typeof photoObj != 'undefined') {
      photo.image = photoObj[0].url
      const fileExtension = getFileExtension(photoObj[0].filename)
      const fileName = `${id}.${fileExtension}`
      photo.filename = fileName
      data.photo = fileName
    }
    if (photo.image === '' || typeof photo.image === 'undefined') {
      console.log(`There was a problem with ${name}'s image`)
    } else {
      speakersImages.push(photo)
    }
    speakersData.push(data)
  }
  return { speakersData, speakersImages }
}
