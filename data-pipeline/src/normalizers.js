export const makeEventId = eventName => {
  if (typeof eventName === 'undefined') {
    return ''
  }
  return eventName.replace('SeattleJS ', '').toLowerCase().replaceAll(' ', '-')
}

export const makeTalkId = (speakerId, eventId) => {
  return speakerId + '-' + eventId
}

export const makeSpeakerId = speakerName => {
  return (
    speakerName
      .toLowerCase()
      .replaceAll(' ', '-')
      // remove non-alphanumeric except for '-'
      .replace(/[^a-z0-9-]/gim, '')
  )
}

export const normalizeTalkTitle = talkName => {
  return talkName
}

export const normalizeTalkAbstract = talkAbstract => {
  return talkAbstract
}

export const normalizeTwitterHandle = rawTwitter => {
  if (typeof rawTwitter === 'undefined') {
    return ''
  }
  let clean = rawTwitter.trim()
  if (clean[0] === '@') {
    clean = clean.slice(1)
  }
  return clean
}

export const normalizeSponsorName = sponsorName => {
  if (typeof sponsorName === 'undefined') {
    return ''
  }
  return (
    sponsorName
      .trim()
      .toLowerCase()
      // handle things like 'Customer.io'
      .replaceAll('.', '-')
      .replaceAll(' ', '-')
      .replace(/[^a-z0-9-]/g, '')
      // handle things like 'Shopify / Remix'
      .replaceAll('--', '-')
  )
}

export const getFileExtension = fileName => {
  if (typeof fileName === 'undefined') {
    return ''
  }
  let temp = fileName.trim().toLowerCase().split('.').slice(-1)[0]
  if (temp === 'jpeg') {
    temp = 'jpg'
  }
  return temp
}
