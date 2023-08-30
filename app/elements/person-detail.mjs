export default function PersonDetail({ html, state = {} }) {
  const { attrs } = state
  let { name, company, twitter, photo, pronouns, location, url, linkedin } =
    attrs
  let links = { twitter, url, linkedin }
  return html`
    <style>
      h3 {
        margin: 0;
      }
      p {
        margin: 8px 0 16px 0;
      }
      .photo img {
        height: 300px;
        width: 300px;
      }
      ul {
        list-style: none;
        margin: 8px 0 0 0;
        padding: 0;
      }
      @media only screen and (min-width: 768px) {
        .info {
          display: flex;
        }
        .more {
          margin-left: 24px;
        }
      }
    </style>
    <h2>About ${name}</h2>
    <div class="info">
      <div class="photo"><img src="${photo}" alt="photo of ${name}" /></div>
      <div class="more">
        ${pronouns && `<h3>Pronouns</h3><p>${pronouns}</p>`}
        ${location && `<h3>Location</h3><p>${location}</p>`}
        ${company && `<h3>Company</h3><p>${company}</p>`}
        ${(twitter || url || linkedin) &&
        html` <h3>Links</h3>
          <list-links links=${links}></list-links>`}
      </div>
    </div>
  `
}
