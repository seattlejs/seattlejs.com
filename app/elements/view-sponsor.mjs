import { marked } from 'marked'

export default function ViewSpeaker({ html, state = {} }) {
  const { attrs } = state
  let { url, name, image, copy } = attrs
  return html`
    <p>
      <a href="${url}" target="_new"
        ><img src="/_public/images/sponsors/${image}" alt="logo for ${name}"
      /></a>
    </p>
    <p>${marked(copy)}</p>
  `
}
