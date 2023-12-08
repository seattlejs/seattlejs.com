import { marked } from 'marked'

export default function ({ html, state = {} }) {
  const { store = {} } = state
  const { workshop, social } = store
  const { title, abstract, topics, speaker } = workshop
  const { name, photo } = speaker
  if (social) {
    return html`
      <div style="background-image: url('/_public/images/social-sharing-card-conf.png'); height: 628px; width: 1200px">
        <div style="position: absolute; top: 230px; left: 152px">
            <img src="/_public/images/speakers/${ photo }" alt="photo of ${ name }" width="278" height="278"/>
        </div>
        <div style="position: absolute; top: 530px; left: 152px; font-size: 27px">
            ${ name }
        </div>
        <div style="position: absolute; top: 40px; left: 600px; width: 550px">
            <span style="font-family: 'headline-gothic-atf-rough-n1'; font-size: 85px; color:#052460; font-weight: 400; line-height: 1em">${ title }</span>
        </div>
      </div>
      `
  }
  else {  
    // set the "photo" property with an absolute path (so that the <person-detail> element will work)
    let speakerClone = { ...speaker }
    speakerClone.photo = '/_public/images/speakers/' + speaker.photo
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
      <page-layout title=${workshop.title}>      
        <h2>${ title }</h2>
        <div class="topics">${ topics.map(t => `<div class=topic>${ t }</div>`).join('') }</div>
        <div class="abstract">${ marked.parse(abstract) }</div>
        <div class="cta"><a target="_blank" href="https://ti.to/event-loop/seattlejs-conf-2023/">Register</a></div>
        <person-detail ${ speakerProps }></person-detail>
      </page-layout>
    `
  }
}
