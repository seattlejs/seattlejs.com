function futureTalks(talks) {
  const ONE_DAY = 1000 * 60 * 60 * 24
  return talks.filter(t => (new Date(t.date)).getTime() + ONE_DAY > Date.now())
}

function Talk(talk) {
  let { name, company, twitter, photo, title, abstract, date } = talk
  let d = new Date(date)
  return /*html*/`
          <div class="talk">
              <div class="photo">
                  <img src="/images/speakers/${ photo }" alt="photo of ${ name }"/>
                  <p><a target="_blank" href="https://twitter.com/${ twitter }">${ name }</a> // ${ company }</p>
              </div>
              <div class="details">
                  <h3>${ title }</h3>
                  <p>${ abstract }</p>
                  <p>Coming up: ${ new Intl.DateTimeFormat('en-US', {month: 'long'}).format(d) } ${ d.getFullYear() } </p>
              </div>
          </div>
      `
}

export default function UpcomingTalks({ html, state = { } }) {
  const { store = { } } = state
  const { talks } = store
  if (futureTalks(talks).length === 0) {
    return html`<p>There are no upcoming talks at the moment. Consider submitting an idea to our CFP!</p>`
  }
  else {
    return html(futureTalks(talks).map(Talk))
  }
}