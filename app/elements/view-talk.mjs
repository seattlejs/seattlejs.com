//import { marked } from 'marked'

export default function ViewTalk({ html, state = {} }) {
  const { attrs, store } = state
  let { events, event } = store
  let { id, event_id } = attrs
  if (!event) {
    event = events.find(e => e.id === event_id)
  }
  
  let talk = event.talks.find(t => t.id === id)

  let { title, speaker, type } = talk
  let { name, company, photo, location } = speaker
  return html`
    <div class="person">
      <!--a href="#"-->
        <div class="person-photo">
          <img src="/_public/images/speakers/${ photo }" alt="photo of ${ name }"/>
          <div class="overlay">
            <div class="text">${ type === "lightning" ? "⚡️" : "" }${ title }</div>
          </div>
        </div>
      <!--/a-->
      <div class="person-info">
        <div class="person-name">${ name }</div>
        <div class="person-misc">
          ${ company }<br/>${ location }
        </div>
      </div>
    </div>
  `
}
