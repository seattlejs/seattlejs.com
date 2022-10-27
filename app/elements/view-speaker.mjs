export default function ViewSpeaker({ html, state = { } }) {
  const { attrs } = state
  let { name, company, twitter, photo } = attrs
  return html`
    <div class="speaker"><img src="/_public/images/speakers/${ photo }" alt="photo of ${ name }"/></div>
    <p><a target="_blank" href="https://twitter.com/${ twitter }">${ name }</a> // ${ company }</p>
  `
}