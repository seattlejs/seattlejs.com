//import { marked } from 'marked'

export default function ViewTalk({ html, state = {} }) {
  const { attrs, store } = state
  let { events, event } = store
  let { id, event_id, url } = attrs
  if (!event) {
    event = events.find(e => e.id === event_id)
  }
  
  let talk = event.talks.find(t => t.id === id)

  let { title, speaker, type } = talk
  let { name, company, photo, location } = speaker
  return html`
    <style>
      .speaker {
        margin-right: 16px;
      }

      .photo {
        position: relative;
        height: 250px;
        width: 250px;
      }

      .photo .overlay {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        opacity: 0;
        transition: .5s ease;
        background-color: #ee3e4a;
        }
        
      .photo:hover .overlay {
        opacity: 1;
      }
        
      .photo .overlay .text {
        color: white;
        font-family: headline-gothic-atf-round, sans-serif;
        font-weight: 500;
        font-style: italic;
        font-size: 24px;
        line-height: 1.125em;
        margin: 16px;
        text-align: left;
      }

      .photo img {
        object-fit: cover;
        height: 250px;
        width: 250px;
      }

      .info {
        margin: 8px 0 16px 0;
      }

      .name {
        font-family: headline-gothic-atf-round, sans-serif;
        font-weight: 700;
        font-size: 24px;
      }
    </style>
    <div class="speaker">
      <a href="${ url ? url : `/talks/${ id }` }">
        <div class="photo">
          <img src="/_public/images/speakers/${ photo }" alt="photo of ${ name }"/>
          <div class="overlay">
            <div class="text">${ type === "lightning" ? "⚡️" : "" }${ title }</div>
          </div>
        </div>
      </a>
      <div class="info">
        <div class="name">${ name }</div>
        <div class="misc">
          ${ company }<br/>${ location }
        </div>
      </div>
    </div>
  `
}
