export default function MyHeader({ html }) {
  return html`
    <header>
      <nav>
        <div id="logo">
          <a href="/"
            ><img
              src="/_public/images/logo.png"
              alt="SeattleJS logo"
              width="32"
              height="32"
          /></a>
        </div>
        <button
          class="nav-toggler"
          type="button"
          aria-controls="nav-links"
          aria-expanded="false"
          aria-label="Site navigation"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30">
            <path
              stroke="#fff"
              stroke-linecap="round"
              stroke-miterlimit="10"
              stroke-width="2"
              d="M4 7h22M4 15h22M4 23h22"
            />
          </svg>
        </button>
        <ul id="nav-links">
          <li class="special"><a href="/conf">SeattleJS Conf 2023</a></li>
          <li><a href="/about-us">About Us</a></li>
          <li><a href="/speak">Give a Talk</a></li>
          <li><a href="/join">Join Our Community</a></li>
          <!--a href="/sponsoring">Sponsor Us</a-->
          <li><a href="/code-of-conduct">Code of Conduct</a></li>
          <li>
            <a target="_blank" href="https://ti.to/event-loop/">Tickets</a>
          </li>
        </ul>
      </nav>
    </header>

    <script type="module">
      class MyHeader extends HTMLElement {
        constructor() {
          super()
          const mobileButton = this.querySelector('.nav-toggler')
          mobileButton.addEventListener('click', () => {
            const expanded =
              mobileButton.getAttribute('aria-expanded') === 'true'
            mobileButton.setAttribute('aria-expanded', !expanded)
          })
        }
      }

      customElements.define('my-header', MyHeader)
    </script>
  `
}
