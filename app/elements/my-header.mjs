export default function MyHeader({ html }) {
  return html`
      <header>
        <nav>
          <div id="logo"><a href="/"><img src="/_public/images/logo.png"></a></div>
          <div><a href="/about-us">About Us</a></div>
          <!--a href="/events">Events</a>
          <a href="/speakers">Speakers</a>
          <a href="/speak">Give a Talk</a-->
          <div><a href="/join">Join Our Community</a></div>
          <!--a href="/sponsoring">Sponsor Us</a-->
          <div><a href="/code-of-conduct">Code of Conduct</a></div>
        </nav>
      </header>
    `
}