export default function ViewSpeaker({ html, state = {} }) {
  const { attrs } = state
  let { name, company, twitter, photo } = attrs
  return html`
    <div class="speaker">
      <div class="name">${ name }</div>
      <div><img src="/_public/images/speakers/${photo}" alt="photo of ${name}" /></div>
      <div><span class="company">${company}</span><span class="twitter">${twitter
        ? ` <a target="_twitter" href="https://twitter.com/${twitter}"><i class="fab fa-twitter"></i></a>`
        : ``
      }</span></div>
    </div>
  `
}
