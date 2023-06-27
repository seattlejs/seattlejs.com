export default function ViewSponsor({ html, state = {} }) {
  const { attrs } = state
  let { url, name, image, tier } = attrs
  return html`
    <style>
       .platinum img {
        height: 200px;
       }

       .gold img {
        height: 100px;
       }
    </style>
    <div class="${ tier }">
      <a href="${url}" target="_new"
        ><img src="/_public/images/sponsors/${image}" alt="logo for ${name}"
      /></a>
    </div>
  `
}
