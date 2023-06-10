import { marked } from 'marked'

export default function ({ html, state = {} }) {
  const { store = {} } = state
  const { talk } = store
  const { title, abstract, topics, speaker } = talk
  // override the "photo" property
  speaker.photo = '/_public/images/speakers/' + speaker.photo
  const speakerProps = Object.keys(speaker).map(key => `${key}="${speaker[key]}"`).join(' ')
  
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
    <page-layout title=${talk.title}>      
      <h2>${ title }</h2>
      <div class="topics">${ topics.map(t => `<div class=topic>${ t }</div>`).join('') }</div>
      <div class="abstract">${ marked.parse(abstract) }</div>
      <person-detail ${ speakerProps }></person-detail>
    </page-layout>
  `
}
