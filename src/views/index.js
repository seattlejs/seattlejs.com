let Layout = require('./layout')

function futureTalks(talks) {
    const ONE_DAY = 1000 * 60 * 60 * 24
    return talks.filter(t => (new Date(t.date)).getTime() + ONE_DAY > Date.now())
}

function Talk(talk) {
    let { name, company, twitter, photo, title, abstract } = talk
    return /*html*/`
        <div class="talk">
            <div class="photo"><img src="/images/speakers/${ photo }" alt="photo of ${ name }"/></div>
            <div class="details">
                <h3>${ title }</h3>
                <p>${ abstract }</p>
                <p>Speaker: ${ name }</p>
                <p>Company: ${ company }</p>
                <p>Twitter: <a target="_blank" href="https://twitter.com/${ twitter }">@${ twitter }</a></p>
            </div>
        </div>
    `
}

let Template = function({ talks }) {
    return /*html*/`
    <img src="/images/blank-seattlejs-header.png" alt="SeattleJS header image"/>
    <h1>SeattleJS - a meetup for web developers in Seattle, WA</h1>
    <h2>Upcoming Talks</h2>
    ${ futureTalks(talks).map(Talk) }
    <p>Join us for an <a href="https://ti.to/event-loop/">upcoming meetup</a>, everyone is welcome!</p>
    <h2>Mailing List</h2>
    <p>Stay up-to-date on upcoming meetups and other fun announcements by joining our <a href="/signup">community mailing list</a>.</p>
    <h2>Code</h2>
    <p>The code for this website is hosted on <a href="https://github.com/seattlejs/seattlejs.com">Github</a>.</p>
`
}

module.exports = async function Index({ talks }) {
    let content = Template({ talks })
    html = Layout({ content })
    return { html }
}
