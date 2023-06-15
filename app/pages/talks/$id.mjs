import { marked } from 'marked'

export default function ({ html, state = {} }) {
  const { store = {} } = state
  const { talk } = store
  const { title, abstract, topics, speaker } = talk
  // set the "photo" property with an absolute path (so that the <person-detail> element will work)
  let speakerClone = { ...speaker }
  speakerClone.photo = '/_public/images/speakers/' + speaker.photo
  console.log(speakerClone)
  const speakerProps = Object.keys(speakerClone).map(key => `${key}="${speakerClone[key]}"`).join(' ')
  
  return html`
    <style>
      .topics {
        display: flex;
        flex-wrap: wrap;
      }
      .topic {
          display: inline-block;
          background-color: #CFD3E4;
          text-decoration: none;
          margin:3px;
          padding:8px;
      }
    </style>
    <page-layout>      
      <h2>${ title }</h2>
      <div class="topics">${ topics.map(t => `<div class=topic>${ t }</div>`).join('') }</div>
      <div class="abstract">${ marked.parse(abstract) }</div>
      <person-detail ${ speakerProps }></person-detail>
    </page-layout>
  `
}
