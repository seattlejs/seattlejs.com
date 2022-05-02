let Layout = require('./layout')

let Template = function() {
    return /*html*/`
    <img src="/images/blank-seattlejs-header.png" alt="SeattleJS header image"/>
    <h1>SeattleJS - a meetup for web developers in Seattle, WA</h1>
    <h2>Events</h2>
    <p>Join us for an <a href="https://ti.to/event-loop/">upcoming meetup</a>, everyone is welcome!</p>
    <h2>Mailing List</h2>
    <p>Stay up-to-date on upcoming meetups and other fun announcements by joining our <a href="/signup">community mailing list</a>.</p>
    <h2>Code</h2>
    <p>The code for this website is hosted on <a href="https://github.com/seattlejs/seattlejs.com">Github</a>.</p>
`
}

module.exports = async function Index() {
    let content = Template()
    html = Layout({ content })
    return { html }
}
