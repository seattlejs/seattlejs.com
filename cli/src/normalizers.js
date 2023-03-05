exports.makeEventId = eventName => {
  return eventName.replace('SeattleJS ', '').toLowerCase().replaceAll(' ', '-')
}

exports.makeTalkId = (speakerId, eventId) => {
  return speakerId + '-' + eventId
}

exports.makeSpeakerId = speakerName => {
  return speakerName.toLowerCase().replaceAll(' ', '-')
}

exports.normalizeTalkTitle = talkName => {
  return talkName
}

exports.normalizeTalkAbstract = talkAbstract => {
  return talkAbstract
}

exports.normalizeTwitterHandle = rawTwitter => {
  if (typeof rawTwitter === 'undefined') {
    return ''
  }
  if (rawTwitter[0] === '@') {
    return rawTwitter.slice(1)
  }
}
