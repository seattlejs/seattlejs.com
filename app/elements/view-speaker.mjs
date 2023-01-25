export default function ViewSpeaker({ html, state = { } }) {
  const { attrs } = state
  let { name, company, twitter, photo } = attrs
  return html`
    <div class="speaker"><img src="/_public/images/speakers/${ photo }" alt="photo of ${ name }"/></div>
    <p>${ name } | ${ company } ${ twitter ? `| <a target="_blank" href="https://twitter.com/${ twitter }">@${ twitter }</a>` : `` }</p>
  `
}