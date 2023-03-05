exports.getAirtableData = async (airtableBase, prompts) => {
  const eventsId = process.env.EVENTS_TABLE_ID
  const speakersId = process.env.SPEAKERS_TABLE_ID

  const events = []
  await airtableBase(eventsId)
    // grid view omits RSVPs, which is a very verbose field
    .select({ view: 'Grid view', sort: [{ field: 'Date', direction: 'asc' }] })
    .eachPage(function page(records, fetchNextPage) {
      records.forEach(r => {
        events.push(r)
        fetchNextPage()
      })
    })
  // grab the last 3 events
  const nearEvents = events.slice(-3)
  const choices = await Promise.all(
    nearEvents.map(async e => {
      const speakerIds = e.get('Speakers')
      const speakers = await Promise.all(
        speakerIds.map(speaker => airtableBase(speakersId).find(speaker))
      )
      const speakerNames = await speakers.map(speaker =>
        speaker.get('Full Name')
      )
      return {
        title: e.get('Name'),
        description: `speakers: ${speakerNames}`,
        value: { eventObj: e, speakerObjects: speakers }
      }
    })
  )
  const choice = await prompts({
    type: 'select',
    name: 'eventChoice',
    message: 'which event would you like to update?',
    choices: choices
  })
  return choice.eventChoice
}

exports.getAirtableSponsors = async (airtableBase, prompts) => {
  const sponsorsId = process.env.SPONSORS_TABLE_ID
  const sponsors = []
  await airtableBase(sponsorsId)
    .select()
    .eachPage(function page(records, fetchNextPage) {
      records.forEach(r => {
        sponsors.push(r)
        fetchNextPage()
      })
    })
  const choices = sponsors.map(sponsor => {
    return {
      title: sponsor.get('Name'),
      description: sponsor.get('Website'),
      value: sponsor
    }
  })
  const selections = await prompts({
    type: 'multiselect',
    name: 'sponsorChoice',
    min: 1,
    message:
      'which sponsor(s) would you like to update? You can pick more than one.',
    hint: 'press right arrow to select',
    choices: choices
  })
  return selections.sponsorChoice
}
