export default function MyHeader({ html }) {
  return html`
    <header>
      <nav>
        <div id="logo">
          <a href="/"><img src="/_public/images/logo.png" /></a>
        </div>
        <details>
          <summary>Site navigation</summary>
          <ul>
            <li><a href="/about-us">About Us</a></li>
            <li><a href="/speak">Give a Talk</a></li>
            <li><a href="/join">Join Our Community</a></li>
            <!--a href="/sponsoring">Sponsor Us</a-->
            <li><a href="/code-of-conduct">Code of Conduct</a></li>
            <li>
              <a target="_blank" href="https://ti.to/event-loop/">Tickets</a>
            </li>
          </ul>
        </details>
      </nav>
    </header>
  `
}
