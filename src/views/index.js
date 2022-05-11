let Layout = require('./layout')

function futureTalks(talks) {
    const ONE_DAY = 1000 * 60 * 60 * 24
    return talks.filter(t => (new Date(t.date)).getTime() + ONE_DAY > Date.now())
}

function Talk(talk) {
    let { name, company, twitter, photo, title, abstract, date } = talk
    let d = new Date(date)
    return /*html*/`
        <div class="talk">
            <div class="photo"><img src="/images/speakers/${ photo }" alt="photo of ${ name }"/></div>
            <div class="details">
                <h3>${ title }</h3>
                <p>${ abstract }</p>
                <p>Meetup: ${ new Intl.DateTimeFormat('en-US', {month: 'long'}).format(d) } ${ d.getFullYear() } </p>
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
    <h2>About Us</h2>
    <p><img src="/images/seattlejs-march-2022.jpg" alt="SeattleJS March 2022 group photo"/></p>
    <p>SeattleJS is the largest JavaScript meet up in Seattle. We hold our meet ups on the second Wednesday of every month.</p>
    <p>SeattleJS exisits to inform, inspire, and encourage members of the JavaScript community. Our goal is for you to leave inspired and ready to innovate.</p>
    <h2>Venue</h2>
    <p>We meet at <a href="https://www.collectiveseattle.com">The Collective Seattle</a>, a co-working space and community in South Lake Union.</p>
    <ul>
        <li><a href="https://goo.gl/maps/rc11qrTiJXffBagC7">400 Dexter Ave N</a></li>
        <li>Street parking is free after 6pm</li>
    </ul>
    <p>Members of SeattleJS can sign-up for a <a href="https://www.collectiveseattle.com/visitus">free Day Pass</a>. Feel free to bring your laptop for work or climbing shoes to hop on the bouldering wall - make a day of it!</p>
    <h2>Upcoming Talks</h2>
    ${ futureTalks(talks).map(Talk) }
    <h2>Attend</h2>
    <p>RSVP for an <a href="https://ti.to/event-loop/">upcoming meetup</a>, everyone is welcome!</p>
    <h2>Join our Community</h2>
    <ul>
        <li>Sign-up for our zero-spam <a href="/signup">community mailing list</a></li>
        <li>Join us on <a href="https://discord.gg/HQdmgyWN58">Discord</a></li>
        <li>Follow-up on <a href="https://twitter.com/cascadiajs">Twitter</a></li>
    </ul>
    <h2>Sponsor Us</h2>
    <p>If your company would like to sponsor an upcoming meetup, please email us at <a href="mailto:info@cascadiajs.com">info@cascadiajs.com</a>.
    <h2>Code</h2>
    <p>The code for this website is hosted on <a href="https://github.com/seattlejs/seattlejs.com">Github</a>.</p>
`
}

module.exports = async function Index({ talks }) {
    let content = Template({ talks })
    html = Layout({ content })
    return { html }
}
