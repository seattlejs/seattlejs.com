import { marked } from 'marked'

export default function ViewTalk({ html, state = {} }) {
  const { attrs, store } = state
  const { events } = store
  let { id, event_id } = attrs
  let event = events.find(e => e.id === event_id)
  let talk = event.talks.find(t => t.id === id)

  // find talk/speaker from events
  let { title, abstract, speaker, type } = talk
  let { name, twitter, company, photo } = speaker
  return html`
    <h4>${name} - ${type === 'lightning' ? '⚡️ ' : ''}${title}</h4>
    <p>${marked(abstract)}</p>
    <view-speaker
      name="${name}"
      twitter="${twitter}"
      company="${company}"
      photo="${photo}"
    ></view-speaker>
  `
}
