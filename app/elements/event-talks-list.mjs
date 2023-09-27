export default function EventTalk({ html, state = {} }) {
  const { store } = state
  let { eventTalks, eventSpeakers } = store

  return html`
    <ul>
      ${eventTalks.length > 0 ?eventTalks
        .map(
          t =>
            /*html*/ `<event-talk talkId=${t.id} speakerId=${
              eventSpeakers.find(s => s.id === t.speaker_id).id
            }></event-talk>`
        )
        .join(''): 'No talks this month.'}
    </ul>
  `
}
