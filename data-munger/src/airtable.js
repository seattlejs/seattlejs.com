export const getAirtableEvents = async airtableBase => {
  const eventsId = process.env.EVENTS_TABLE_ID
  const events = []
  await airtableBase(eventsId)
    // grid view omits RSVPs, which is a very verbose field
    .select({ view: 'Grid view', sort: [{ field: 'Date', direction: 'asc' }] })
    .eachPage(function page(records, fetchNextPage) {
      records.forEach(r => {
        events.push(r)
      })
      fetchNextPage()
    })
  return events
}

export const getAirtableSpeakers = async airtableBase => {
  const speakersId = process.env.SPEAKERS_TABLE_ID
  const speakers = []
  await airtableBase(speakersId)
    .select()
    .eachPage(function page(records, fetchNextPage) {
      records.forEach(r => {
        speakers.push(r)
      })
      fetchNextPage()
    })
  return speakers
}

export const getAirtableSponsors = async airtableBase => {
  const sponsorsId = process.env.SPONSORS_TABLE_ID
  const sponsors = []
  await airtableBase(sponsorsId)
    .select()
    .eachPage(function page(records, fetchNextPage) {
      records.forEach(r => {
        sponsors.push(r)
      })
      fetchNextPage()
    })
  return sponsors
}
