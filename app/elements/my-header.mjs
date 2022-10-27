export default function MyHeader({ html }) {
  return html`
      <header>
        <nav>
          <div id="logo"><a href="/"><img src="/_public/images/logo.png"></a></div>
          <div><a href="/about-us">About Us</a></div>
          <div><a href="/speak">Give a Talk</a></div>
          <div><a href="/join">Join Our Community</a></div>
          <!--a href="/sponsoring">Sponsor Us</a-->
          <div><a href="/code-of-conduct">Code of Conduct</a></div>
          <div><a target="_blank" href="https://ti.to/event-loop/">Tickets</a></div>
        </nav>
      </header>
    `
}