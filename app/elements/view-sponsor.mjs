export default function ViewSponsor({ html, state = {} }) {
  const { attrs } = state
  let { url, name, image } = attrs
  return html`
    <div>
      <a href="${url}" target="_new"
        ><img src="/_public/images/sponsors/${image}" alt="logo for ${name}"
      /></a>
    </div>
  `
}
